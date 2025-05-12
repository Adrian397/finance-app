<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
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
        ValidatorInterface          $validator
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

        $errors = $validator->validate($user, null, ['Default', 'registration']);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()][] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $password = $data['password'] ?? null;
        if (empty($password)) {
            return $this->json(['errors' => ['password' => ['Password cannot be empty.']]], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $hashedPassword = $passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        try {
            $entityManager->persist($user);
            $entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['error' => 'An error occurred while registering the user. ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
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