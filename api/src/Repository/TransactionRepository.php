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
}