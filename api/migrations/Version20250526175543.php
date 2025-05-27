<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250526175543 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE `transaction` (id INT AUTO_INCREMENT NOT NULL, recipient_sender VARCHAR(255) NOT NULL, category VARCHAR(100) NOT NULL, transaction_date DATETIME NOT NULL, amount NUMERIC(10, 2) NOT NULL, type VARCHAR(10) NOT NULL, avatar_url VARCHAR(255) DEFAULT NULL, is_recurring TINYINT(1) NOT NULL, owner_id INT NOT NULL, INDEX IDX_723705D17E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE `transaction` ADD CONSTRAINT FK_723705D17E3C61F9 FOREIGN KEY (owner_id) REFERENCES `user` (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE `transaction` DROP FOREIGN KEY FK_723705D17E3C61F9
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE `transaction`
        SQL);
    }
}
