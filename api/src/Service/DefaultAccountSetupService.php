<?php

namespace App\Service;

use App\Entity\Budget;
use App\Entity\Pot;
use App\Entity\Transaction;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\KernelInterface;

class DefaultAccountSetupService
{
    private EntityManagerInterface $entityManager;
    private KernelInterface $kernel;
    private LoggerInterface $logger;

    public function __construct(
        EntityManagerInterface $entityManager,
        KernelInterface        $kernel,
        LoggerInterface        $logger
    )
    {
        $this->entityManager = $entityManager;
        $this->kernel = $kernel;
        $this->logger = $logger;
    }

    public function setupDefaultDataForUser(User $user): void
    {
        $dataJsonPath = $this->kernel->getProjectDir() . '/src/DataFixtures/data.json';

        if (!file_exists($dataJsonPath)) {
            $this->logger->warning("Default Data setup skipped: data.json not found.", ['path' => $dataJsonPath]);
            return;
        }

        $jsonString = file_get_contents($dataJsonPath);
        $jsonData = json_decode($jsonString, true);

        if (isset($jsonData['balance'])) {
            $user->setBalance((string)($jsonData['balance']['current'] ?? 0.00));
            $user->setTotalIncome((string)($jsonData['balance']['income'] ?? 0.00));
            $user->setTotalExpenses((string)($jsonData['balance']['expenses'] ?? 0.00));
        }

        if (isset($jsonData['transactions']) && is_array($jsonData['transactions'])) {
            $this->createDefaultTransactions($user, $jsonData['transactions']);
        } else {
            $this->logger->warning("Default Data: 'transactions' key not found in data.json.", ['user_id' => $user->getId()]);
        }

        if (isset($jsonData['budgets']) && is_array($jsonData['budgets'])) {
            $this->createDefaultBudgets($user, $jsonData['budgets']);
        } else {
            $this->logger->warning("Default Data: 'budgets' key not found in data.json.", ['user_id' => $user->getId()]);
        }

        if (isset($jsonData['pots']) && is_array($jsonData['pots'])) {
            $this->createDefaultPots($user, $jsonData['pots']);
        } else {
            $this->logger->warning("Default Data: 'pots' key not found in data.json.", ['user_id' => $user->getId()]);
        }

        try {
            $this->entityManager->flush();
        } catch (\Exception $e) {
            $this->logger->error("Default Data: Failed to save default data for user.", [
                'user_id' => $user->getId(),
                'error' => $e->getMessage()
            ]);
        }
    }

    private function createDefaultTransactions(User $user, array $transactionsData): void
    {
        foreach ($transactionsData as $item) {
            $transaction = new Transaction();
            $transaction->setOwner($user);
            $transaction->setName($item['name'] ?? 'Unknown Sender/Recipient');
            $transaction->setCategory($item['category'] ?? 'Uncategorized');

            try {
                $transaction->setDate(new \DateTimeImmutable($item['date']));
            } catch (\Exception $e) {
                $this->logger->warning("Default Transactions: Skipping transaction due to invalid date.", [
                    'user_id' => $user->getId(), 'item_name' => $item['name'] ?? 'N/A'
                ]);
                continue;
            }

            $amount = (float)($item['amount'] ?? 0);
            $transaction->setAmount(sprintf('%.2f', $amount));
            $transaction->setType($amount >= 0 ? 'income' : 'expense');

            $avatarPath = $item['avatar'] ?? null;
            if ($avatarPath && strpos($avatarPath, './assets') === 0) {
                $avatarPath = str_replace('./assets', '', $avatarPath);
            }
            $transaction->setAvatar($avatarPath);
            $transaction->setIsRecurring($item['recurring'] ?? false);

            $this->entityManager->persist($transaction);
        }
    }

    private function createDefaultBudgets(User $user, array $budgetsData): void
    {
        foreach ($budgetsData as $item) {
            $budget = new Budget();
            $budget->setOwner($user);
            $budget->setCategory($item['category'] ?? 'Uncategorized');
            $budget->setMaximumAmount((string)($item['maximum'] ?? 0.0));
            $budget->setTheme($item['theme'] ?? null);

            $this->entityManager->persist($budget);
        }
    }

    private function createDefaultPots(User $user, array $potsData): void
    {
        foreach ($potsData as $item) {
            $pot = new Pot();
            $pot->setOwner($user);
            $pot->setName($item['name'] ?? 'Unnamed Pot');
            $pot->setCurrentAmount((string)($item['total'] ?? 0.0));
            $pot->setTargetAmount((string)($item['target'] ?? 0.0));
            $pot->setTheme($item['theme'] ?? null);

            $this->entityManager->persist($pot);
        }
    }
}