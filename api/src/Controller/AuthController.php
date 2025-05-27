<?php

namespace App\Controller;

use App\Entity\Transaction;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController extends AbstractController
{

    #[Route(
        '/api/login',
        name: 'api_login_check',
        methods: ['POST']
    )]
    public function loginCheck(): void
    {
        // Handled by lexik_jwt_authentication.json_login
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request                     $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface      $entityManager,
        ValidatorInterface          $validator,
        KernelInterface             $kernel
    ): JsonResponse
    {
        try {
            $data = $request->toArray();
        } catch (\JsonException $e) {
            return $this->json(['error' => 'Invalid JSON payload: ' . $e->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setName($data['name'] ?? null);
        $user->setEmail($data['email'] ?? null);
        $password = $data['password'] ?? null;

        $allErrorMessages = [];

        $userViolations = $validator->validate($user, null, ['Default', 'registration']);
        if (count($userViolations) > 0) {
            foreach ($userViolations as $violation) {
                $allErrorMessages[$violation->getPropertyPath()][] = $violation->getMessage();
            }
        }

        $passwordConstraints = [
            new Assert\NotBlank(['message' => 'Password should not be empty.']),
            new Assert\Length([
                'min' => 8,
                'minMessage' => 'Your password must be at least {{ limit }} characters long.',
            ]),
        ];
        $passwordViolations = $validator->validate($password, $passwordConstraints);
        if (count($passwordViolations) > 0) {
            foreach ($passwordViolations as $violation) {
                $allErrorMessages['password'][] = $violation->getMessage();
            }
        }

        if (!empty($allErrorMessages)) {
            return $this->json(['errors' => $allErrorMessages], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $hashedPassword = $passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        try {
            $entityManager->persist($user);
            $entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['error' => 'An error occurred while registering the user. ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        $dataJsonPath = $kernel->getProjectDir() . '/src/DataFixtures/data.json';
        if (file_exists($dataJsonPath)) {
            $jsonString = file_get_contents($dataJsonPath);
            $jsonData = json_decode($jsonString, true);

            if (isset($jsonData['transactions']) && is_array($jsonData['transactions'])) {
                foreach ($jsonData['transactions'] as $item) {
                    $transaction = new Transaction();
                    $transaction->setOwner($user);
                    $transaction->setName($item['name'] ?? 'Unknown Sender/Recipient');
                    $transaction->setCategory($item['category'] ?? 'Uncategorized');

                    try {
                        $transaction->setDate(new \DateTimeImmutable($item['date']));
                    } catch (\Exception $e) {
                        error_log("Default Transactions: User {$user->getId()}: Skipping transaction '{$item['name']}' due to invalid date '{$item['date']}'. Error: {$e->getMessage()}");
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

                    $entityManager->persist($transaction);
                }

                try {
                    $entityManager->flush();
                } catch (\Exception $e) {

                    error_log("Default Transactions: User {$user->getId()}: Failed to save default transactions. Error: {$e->getMessage()}");
                }
            } else {
                error_log("Default Transactions: User {$user->getId()}: 'transactions' key not found or not an array in data.json at {$dataJsonPath}");
            }
        } else {
            error_log("Default Transactions: User {$user->getId()}: data.json not found at {$dataJsonPath}");
        }

        return $this->json(
            [
                'message' => 'User registered successfully!',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'name' => $user->getName(),
                ]
            ],
            JsonResponse::HTTP_CREATED
        );
    }

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function getCurrentUser(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(['error' => 'Not authenticated or user not found.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
        ]);
    }
}