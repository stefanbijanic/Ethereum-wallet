-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.26 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for ethereum_wallet
CREATE DATABASE IF NOT EXISTS `ethereum_wallet` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ethereum_wallet`;

-- Dumping structure for table ethereum_wallet.administrator
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL DEFAULT '0',
  `password_hash` varchar(255) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint unsigned NOT NULL,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ethereum_wallet.administrator: ~4 rows (approximately)
DELETE FROM `administrator`;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `created_at`, `is_active`) VALUES
	(1, 'admin', '$2b$10$ZPW1k3OfEqXPRhh7yzrVgulAnLP9ycp.wF3ytwhx6gViyzOYb6ybK', '2021-09-10 17:22:47', 1),
	(5, 'admin2', '$2b$10$6zI/Ewml6vZkpX59kW4xZOh/zc0DxMewTDcfCXF68sgUXbzE9X3a2', '2021-09-10 17:47:40', 0),
	(6, 'username', '$2b$10$LgzIbxxMg89ox3sK0ghPR.PruNiMPNiu5PB2jDuZRt0i3NhoyE7Yy', '2021-09-15 15:46:43', 1),
	(7, 'user12345', '$2b$10$1lJf0A21DORpoksOYnIIfObwh5giN.nodzUhtpPMQqD1Jtgl2gNcu', '2021-09-15 15:48:08', 1);
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

-- Dumping structure for table ethereum_wallet.user
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(128) NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint unsigned NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_username` (`username`),
  UNIQUE KEY `uq_user_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ethereum_wallet.user: ~4 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `username`, `password_hash`, `first_name`, `last_name`, `email`, `created_at`, `is_active`) VALUES
	(1, 'User', '$2b$10$GNJVl3n8iubrAdQKhq60EOHRX30PwwZYucGaV5i.o0wn52OUv0T0W', 'Stefan', 'Bijanic', 'bijanic32@gmail.com', '2021-09-10 19:01:57', 1),
	(3, 'User123', '$2b$10$/uInF.18VSZjq6jAuHpFTeZ01pXXxJ.XmxwHFGJ7OsbiGfld2SgKi', 'marko', 'MM', 'marko@gmail.com', '2021-09-10 19:02:29', 0),
	(6, 'user12345', '$2b$10$RTN9QFT39uCKAQW67yNEZO6o437hM.JEt5tsI2.Epb0knOmbqsrji', 'Stefan', 'Bijanic', 'stefan@bijanic.com', '2021-09-16 13:51:18', 1),
	(7, 'stef', '$2b$10$J0u.pdvXpEdmRlH2RtbUWeuOT7VR872.6KKBa.CDMhHdtsAhNgwD.', 'Stefan', 'Stefanijevic', 'biketa@bijanic.com', '2021-09-16 14:00:18', 1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

-- Dumping structure for table ethereum_wallet.wallet
CREATE TABLE IF NOT EXISTS `wallet` (
  `wallet_id` int unsigned NOT NULL AUTO_INCREMENT,
  `wallet_name` varchar(32) NOT NULL DEFAULT '0',
  `public_address` varchar(255) NOT NULL DEFAULT '0',
  `private_key` varchar(255) NOT NULL DEFAULT '0',
  `balance` decimal(20,18) DEFAULT NULL,
  `user_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wallet_id`),
  UNIQUE KEY `uq_wallet_public_address_private_key` (`public_address`,`private_key`),
  KEY `fk_wallet_user_id` (`user_id`),
  CONSTRAINT `fk_wallet_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ethereum_wallet.wallet: ~6 rows (approximately)
DELETE FROM `wallet`;
/*!40000 ALTER TABLE `wallet` DISABLE KEYS */;
INSERT INTO `wallet` (`wallet_id`, `wallet_name`, `public_address`, `private_key`, `balance`, `user_id`, `created_at`) VALUES
	(1, 'Prvi Wallet', '0x20843619fb933ea7a5cc3bcbe7eafd6823a8e19d', '0x5b3ca07f077857386771abb188c092d4019a5cfadb07eba1185429b4fa2132df', 0.000000000000000000, 1, '2021-09-10 21:26:59'),
	(2, 'Drugi Bolji Wallet', '0x114c58a6f62839a109e75d117b010fb6711c5465', '0xbee49683bee28c4268f8db530aa8a6f5f5352334a3544ceabe34e40565e1aeb1', 0.000000000000000000, 1, '2021-09-10 21:32:13'),
	(3, 'odlican Wallet', '0xa9343b118be06df5c20d195ae203d4b8eec5f1d2', '0x29002a53379dd7381c649d89f8db01086402d4a2ae312405c6ec621b672556b2', 0.997785419014716000, 7, '2021-09-10 23:45:41'),
	(8, 'stef', '0xc20a5819f18d3a61910103b1bcf75b58b76590bd', '0x5cc0ee7e82a44eb04a21a5279b954d5c4dc5b4ec6c0c669abbed37bcca756ba7', 0.001000000000000000, 7, '2021-09-16 16:41:14'),
	(9, 'stef', '0xd17aa02284078fa5272d9209c0fa64d4b81e58ad', '0xc9c206da973779a38ec2fe1c5b18883c078b60c56ef188d041cece1b08525f04', 0.000000000000000000, 7, '2021-09-16 16:49:08'),
	(10, 'aaaaaaaaa', '0x1f488b12a89394adeff8a429c6ec4de711bad159', '0xd2fef67a14bb9d6b2d90c3bf53f96b0abea839312452629d6a00734d307d8bba', 0.000000000000000000, 7, '2021-09-16 17:09:25');
/*!40000 ALTER TABLE `wallet` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
