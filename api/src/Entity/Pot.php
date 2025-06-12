<?php

namespace App\Entity;

use App\Repository\PotRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: PotRepository::class)]
class Pot
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['pot:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    #[Assert\NotNull]
    private ?User $owner = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: "The pot name cannot be empty.")]
    #[Assert\Length(max: 30, maxMessage: "The pot name cannot be longer than {{ limit }} characters.")]
    #[Groups(['pot:read', 'pot:write'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Assert\NotNull]
    #[Groups(['pot:read', 'pot:write'])]
    private ?string $currentAmount = '0.00';

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Assert\NotBlank(message: "The target amount cannot be empty.")]
    #[Assert\Type(type: "numeric", message: "The target amount must be a number.")]
    #[Assert\Positive(message: "The target amount must be a positive number.")]
    #[Groups(['pot:read', 'pot:write'])]
    private ?string $targetAmount = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['pot:read', 'pot:write'])]
    private ?string $theme = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getCurrentAmount(): ?string
    {
        return $this->currentAmount;
    }

    public function setCurrentAmount(string $currentAmount): static
    {
        $this->currentAmount = $currentAmount;
        return $this;
    }

    public function getTargetAmount(): ?string
    {
        return $this->targetAmount;
    }

    public function setTargetAmount(string $targetAmount): static
    {
        $this->targetAmount = $targetAmount;
        return $this;
    }

    public function getTheme(): ?string
    {
        return $this->theme;
    }

    public function setTheme(?string $theme): static
    {
        $this->theme = $theme;
        return $this;
    }
}