<?php

namespace App\Repository;

use App\Entity\Transaction;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;


/**
 * @extends ServiceEntityRepository<Transaction>
 */
class TransactionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Transaction::class);
    }

    /**
     * Finds transactions for a user with optional filters, sorting, and pagination.
     * @return array{items: Transaction[], totalItems: int}
     */
    public function findUserTransactionsByFilters(
        User    $user,
        ?string $searchTerm,
        ?string $category,
        string  $sortBy = 'latest',
        int     $page = 1,
        int     $limit = 10
    ): array
    {
        $qb = $this->createQueryBuilder('t')
            ->andWhere('t.owner = :user')
            ->setParameter('user', $user);

        if ($searchTerm) {
            $qb->andWhere($qb->expr()->orX(
                $qb->expr()->like('LOWER(t.name)', ':searchTerm'),
                $qb->expr()->like('LOWER(t.category)', ':searchTerm')
            ))
                ->setParameter('searchTerm', '%' . strtolower($searchTerm) . '%');
        }

        if ($category) {
            $qb->andWhere('t.category = :category')
                ->setParameter('category', $category);
        }

        switch ($sortBy) {
            case 'oldest':
                $qb->orderBy('t.date', 'ASC');
                break;
            case 'name_asc':
                $qb->orderBy('t.name', 'ASC');
                break;
            case 'name_desc':
                $qb->orderBy('t.name', 'DESC');
                break;
            case 'amount_asc':
                $qb->orderBy('t.amount', 'ASC');
                break;
            case 'amount_desc':
                $qb->orderBy('t.amount', 'DESC');
                break;
            case 'latest':
            default:
                $qb->orderBy('t.date', 'DESC');
                break;
        }

        $qb->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        $query = $qb->getQuery();
        $paginator = new Paginator($query, true);

        return [
            'items' => iterator_to_array($paginator->getIterator()),
            'totalItems' => count($paginator),
        ];
    }

    /**
     * Calculates the total income or expenses for a user within a specific date range.
     */
    public function calculateTotalsForMonth(User $user, string $type): float
    {

        $startOfMonth = new \DateTimeImmutable('2024-08-01 00:00:00');
        $endOfMonth = new \DateTimeImmutable('2024-08-31 23:59:59');

        $qb = $this->createQueryBuilder('t')
            ->select('SUM(t.amount) as total')
            ->where('t.owner = :user')
            ->andWhere('t.date BETWEEN :start AND :end')
            ->setParameter('user', $user)
            ->setParameter('start', $startOfMonth)
            ->setParameter('end', $endOfMonth);

        if ($type === 'income') {
            $qb->andWhere('t.amount > 0');
        } elseif ($type === 'expense') {
            $qb->andWhere('t.amount < 0');
        }

        $result = $qb->getQuery()->getSingleScalarResult();

        return abs((float)($result ?? 0.0));
    }


    /**
     * Fetches and processes recurring bills for a user for August 2024.
     */
    public function findRecurringBillsSummary(User $user, ?string $searchTerm, string $sortBy): array
    {
        $startOfMonth = new \DateTimeImmutable('2024-08-01 00:00:00');
        $endOfMonth = new \DateTimeImmutable('2024-08-31 23:59:59');

        $transactionsThisMonth = $this->createQueryBuilder('t_month')
            ->where('t_month.owner = :user')
            ->andWhere('t_month.date BETWEEN :start AND :end')
            ->setParameter('user', $user)
            ->setParameter('start', $startOfMonth)
            ->setParameter('end', $endOfMonth)
            ->getQuery()
            ->getResult();

        $paidMap = [];
        foreach ($transactionsThisMonth as $t) {
            $paidMap[strtolower($t->getName())] = true;
        }

        $qb = $this->createQueryBuilder('t_recurring')
            ->andWhere('t_recurring.owner = :user')
            ->andWhere('t_recurring.isRecurring = :isRecurring')
            ->setParameter('user', $user)
            ->setParameter('isRecurring', true);

        if ($searchTerm) {
            $qb->andWhere('LOWER(t_recurring.name) LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . strtolower($searchTerm) . '%');
        }

        $recurringBillTemplates = $qb->getQuery()->getResult();

        $paidBills = [];
        $upcomingBills = [];
        $latestOverallTransactionDate = new \DateTimeImmutable('2024-08-19'); // Hardcoded as per readme
        $dueSoonCutoffDate = $latestOverallTransactionDate->modify('+5 days');

        foreach ($recurringBillTemplates as $bill) {
            $isPaid = isset($paidMap[strtolower($bill->getName())]);
            $dueDateDay = (int)$bill->getDate()->format('d');

            $billData = [
                'name' => $bill->getName(),
                'category' => $bill->getCategory(),
                'amount' => abs((float)$bill->getAmount()),
                'avatar' => $bill->getAvatar(),
                'dueDateDay' => $dueDateDay,
                'status' => $isPaid ? 'paid' : 'upcoming',
                'isDueSoon' => false
            ];

            if ($isPaid) {
                $paidBills[] = $billData;
            } else {
                $billDueDate = new \DateTime("{$startOfMonth->format('Y-m')}-$dueDateDay");
                if ($billDueDate > $latestOverallTransactionDate && $billDueDate <= $dueSoonCutoffDate) {
                    $billData['isDueSoon'] = true;
                }
                $upcomingBills[] = $billData;
            }
        }

        $allBills = array_merge($paidBills, $upcomingBills);

        usort($allBills, function ($a, $b) use ($sortBy) {
            switch ($sortBy) {
                case 'oldest': return $a['dueDateDay'] <=> $b['dueDateDay'];
                case 'name_asc': return strcasecmp($a['name'], $b['name']);
                case 'name_desc': return strcasecmp($b['name'], $a['name']);
                case 'amount_desc': return $b['amount'] <=> $a['amount'];
                case 'amount_asc': return $a['amount'] <=> $b['amount'];
                case 'latest':
                default:
                    return $b['dueDateDay'] <=> $a['dueDateDay'];
            }
        });

        $paidCount = count($paidBills);
        $paidTotal = array_sum(array_column($paidBills, 'amount'));
        $upcomingCount = count($upcomingBills);
        $upcomingTotal = array_sum(array_column($upcomingBills, 'amount'));
        $dueSoonBills = array_filter($upcomingBills, fn($bill) => $bill['isDueSoon']);
        $dueSoonCount = count($dueSoonBills);
        $dueSoonTotal = array_sum(array_column($dueSoonBills, 'amount'));

        return [
            'bills' => $allBills,
            'summary' => [
                'totalBills' => $paidTotal + $upcomingTotal,
                'paidCount' => $paidCount,
                'paidTotal' => $paidTotal,
                'upcomingCount' => $upcomingCount,
                'upcomingTotal' => $upcomingTotal,
                'dueSoonCount' => $dueSoonCount,
                'dueSoonTotal' => $dueSoonTotal,
            ]
        ];
    }
}