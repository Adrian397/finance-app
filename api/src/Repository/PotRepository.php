<?php

namespace App\Repository;

use App\Entity\Pot;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Pot>
 */
class PotRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Pot::class);
    }

    /**
     * Fetches all pots for a user and formats them for the API response.
     * @return array
     */
    public function findUserPotsForApi(User $user): array
    {
        $pots = $this->findBy(['owner' => $user], ['name' => 'ASC']);

        $formattedPots = [];

        foreach ($pots as $pot) {
            $formattedPots[] = [
                'id' => $pot->getId(),
                'name' => $pot->getName(),
                'currentAmount' => (float)$pot->getCurrentAmount(),
                'targetAmount' => (float)$pot->getTargetAmount(),
                'theme' => $pot->getTheme(),
            ];
        }

        return $formattedPots;
    }
}