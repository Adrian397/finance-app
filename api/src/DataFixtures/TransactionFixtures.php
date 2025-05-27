<?php

namespace App\DataFixtures;

use App\Entity\Transaction;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


class TransactionFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {

        $userRepository = $manager->getRepository(User::class);
        $testUser = $userRepository->findOneBy(['email' => 'testuser@example.com']);

        if (!$testUser) {
            $testUser = new User();
            $testUser->setEmail('testuser@example.com');
            $testUser->setName('Test User For Transactions');
            $testUser->setPassword($this->passwordHasher->hashPassword($testUser, 'testpassword'));
            $manager->persist($testUser);

        }

        $jsonString = file_get_contents(__DIR__ . '/data.json');
        $data = json_decode($jsonString, true);

        if (!isset($data['transactions']) || !is_array($data['transactions'])) {
            error_log("TransactionFixtures: 'transactions' key not found or not an array in data.json");
            return;
        }

        foreach ($data['transactions'] as $item) {
            $transaction = new Transaction();
            $transaction->setOwner($testUser);
            $transaction->setName($item['name']);
            $transaction->setCategory($item['category']);
            try {
                $transaction->setDate(new \DateTimeImmutable($item['date']));
            } catch (\Exception $e) {
                error_log("TransactionFixtures: Skipping transaction due to invalid date '{$item['date']}' for '{$item['name']}'. Error: {$e->getMessage()}");
                continue;
            }

            $amount = (float)($item['amount'] ?? 0);
            $transaction->setAmount(sprintf('%.2f', $amount));
            $transaction->setType($amount >= 0 ? 'income' : 'expense');

            $avatarPath = $item['avatar'] ?? null;
            if ($avatarPath) {
                if (strpos($avatarPath, './assets') === 0) {
                    $avatarPath = str_replace('./assets', '', $avatarPath);
                }
            }
            $transaction->setAvatar($avatarPath);
            $transaction->setIsRecurring($item['recurring'] ?? false);

            $manager->persist($transaction);
        }

        $manager->flush();
        echo "Transaction fixtures loaded successfully.\n";
    }
}