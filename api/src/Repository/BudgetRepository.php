<?php

namespace App\Repository;

use App\Entity\Budget;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Budget>
 */
class BudgetRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Budget::class);
    }

    /**
     * Takes a single Budget entity and returns it as an array
     * enriched with calculated spending details.
     */
    public function getBudgetDetails(Budget $budget): array
    {
        $startOfMonth = new \DateTimeImmutable('2024-08-01 00:00:00');
        $endOfMonth = new \DateTimeImmutable('2024-08-31 23:59:59');

        $spentQb = $this->getEntityManager()->createQueryBuilder();
        $spentResult = $spentQb
            ->select('SUM(t.amount) as totalSpent')
            ->from('App\Entity\Transaction', 't')
            ->where('t.owner = :user')
            ->andWhere('t.category = :category')
            ->andWhere('t.amount < 0')
            ->andWhere('t.date BETWEEN :start AND :end')
            ->setParameter('user', $budget->getOwner())
            ->setParameter('category', $budget->getCategory())
            ->setParameter('start', $startOfMonth)
            ->setParameter('end', $endOfMonth)
            ->getQuery()
            ->getSingleScalarResult();

        $spentAmount = abs((float)($spentResult ?? 0.0));

        $latestTransactions = $this->getEntityManager()->getRepository('App\Entity\Transaction')->findBy(
            [
                'owner' => $budget->getOwner(),
                'category' => $budget->getCategory(),
                'type' => 'expense',
            ],
            ['date' => 'DESC'],
            3
        );

        return [
            'id' => $budget->getId(),
            'category' => $budget->getCategory(),
            'maximumAmount' => (float)$budget->getMaximumAmount(),
            'theme' => $budget->getTheme(),
            'spentAmount' => $spentAmount,
            'latestTransactions' => $latestTransactions,
        ];
    }

    /**
     * Fetches all budgets for a user and enriches them with details.
     * @return array
     */
    public function findUserBudgetsWithDetails(User $user): array
    {
        $budgets = $this->findBy(['owner' => $user], ['category' => 'ASC']);

        $budgetDetails = [];
        foreach ($budgets as $budget) {
            $budgetDetails[] = $this->getBudgetDetails($budget);
        }

        return $budgetDetails;
    }
}