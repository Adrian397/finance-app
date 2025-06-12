<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250611171534 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE pot (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(100) NOT NULL, current_amount NUMERIC(10, 2) NOT NULL, target_amount NUMERIC(10, 2) NOT NULL, theme VARCHAR(50) DEFAULT NULL, owner_id INT NOT NULL, INDEX IDX_1EBD730F7E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE pot ADD CONSTRAINT FK_1EBD730F7E3C61F9 FOREIGN KEY (owner_id) REFERENCES `user` (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE pot DROP FOREIGN KEY FK_1EBD730F7E3C61F9
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE pot
        SQL);
    }
}
