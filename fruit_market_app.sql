-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 02, 2025 at 06:20 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fruit_market_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `address_detail`
--

CREATE TABLE `address_detail` (
  `address_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(50) NOT NULL DEFAULT '',
  `address` varchar(250) NOT NULL DEFAULT '',
  `city` varchar(50) NOT NULL DEFAULT '',
  `zip_code` varchar(15) NOT NULL DEFAULT '',
  `lati` varchar(25) NOT NULL DEFAULT '0.0',
  `longi` varchar(25) NOT NULL DEFAULT '0.0',
  `is_default` int(1) NOT NULL DEFAULT 0 COMMENT '0 = No, 1 = Yes',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = deleted',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address_detail`
--

INSERT INTO `address_detail` (`address_id`, `user_id`, `name`, `address`, `city`, `zip_code`, `lati`, `longi`, `is_default`, `status`, `created_date`, `modify_date`) VALUES
(1, 2, 'Home', 'Vivekanand Bridge, Vivekanand Bridge, Katargam', 'Surat', '395001', '21.19381051595097', '72.81505183077631', 0, 1, '2025-04-01 23:26:39', '2025-04-02 23:49:55');

-- --------------------------------------------------------

--
-- Table structure for table `cart_detail`
--

CREATE TABLE `cart_detail` (
  `cart_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL DEFAULT 0,
  `price_id` int(11) NOT NULL DEFAULT 0,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `qty` int(4) NOT NULL DEFAULT 1,
  `status` int(1) NOT NULL DEFAULT 1,
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_detail`
--

INSERT INTO `cart_detail` (`cart_id`, `item_id`, `price_id`, `user_id`, `qty`, `status`, `created_date`, `modify_date`) VALUES
(1, 1, 2, 2, 3, 2, '2025-03-21 23:50:19', '2025-03-27 23:33:37'),
(2, 1, 3, 2, 1, 2, '2025-03-21 23:50:31', '2025-03-27 23:33:33'),
(3, 1, 2, 2, 3, 2, '2025-03-27 23:38:28', '2025-04-03 23:42:34');

-- --------------------------------------------------------

--
-- Table structure for table `category_detail`
--

CREATE TABLE `category_detail` (
  `cat_id` int(11) NOT NULL,
  `cat_name` varchar(50) NOT NULL DEFAULT '',
  `main_cat_id` int(3) NOT NULL DEFAULT 0,
  `subtitle` varchar(100) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = inactive, 1 = active, 2 = deletd',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category_detail`
--

INSERT INTO `category_detail` (`cat_id`, `cat_name`, `main_cat_id`, `subtitle`, `status`, `created_date`, `modify_date`) VALUES
(1, 'Mixed Fruits Pack1', 4, 'Fruit mix fresh pack1', 1, '2025-02-21 21:26:34', '2025-02-21 21:26:50'),
(2, 'Stone Fruits', 4, 'Fresh Stone Fruits', 0, '2025-02-21 21:27:11', '2025-02-21 21:27:11'),
(3, 'Melons', 4, 'Fresh Melons Fruits', 0, '2025-02-21 21:27:30', '2025-02-21 21:27:30');

-- --------------------------------------------------------

--
-- Table structure for table `item_detail`
--

CREATE TABLE `item_detail` (
  `item_id` int(11) NOT NULL,
  `main_cat_id` int(11) NOT NULL DEFAULT 0,
  `cat_id` varchar(200) NOT NULL DEFAULT '',
  `item_name` varchar(75) NOT NULL DEFAULT '',
  `description` varchar(1000) NOT NULL DEFAULT '',
  `image` varchar(100) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = deleted, 0 = inactive',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_detail`
--

INSERT INTO `item_detail` (`item_id`, `main_cat_id`, `cat_id`, `item_name`, `description`, `image`, `status`, `created_date`, `modify_date`) VALUES
(1, 4, '1,2', 'Apple', 'it is small apple.', 'items/202502282359525952eq34UfBSnV.jpg', 1, '2025-02-26 16:09:09', '2025-02-28 23:59:52');

-- --------------------------------------------------------

--
-- Table structure for table `location_detail`
--

CREATE TABLE `location_detail` (
  `location_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `latitude` varchar(25) NOT NULL DEFAULT '0.0',
  `longitude` varchar(25) NOT NULL DEFAULT '0.0',
  `degree` varchar(25) NOT NULL DEFAULT '0.0',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `main_category`
--

CREATE TABLE `main_category` (
  `main_cat_id` int(11) NOT NULL,
  `main_cat_name` varchar(40) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = inactive, 1 = active, 2 = deleted',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `main_category`
--

INSERT INTO `main_category` (`main_cat_id`, `main_cat_name`, `status`, `created_date`, `modify_date`) VALUES
(1, 'Vegetables', 1, '2025-02-20 23:55:27', '2025-02-21 21:12:08'),
(2, 'Fruits', 0, '2025-02-20 23:55:44', '2025-02-21 00:02:06'),
(3, 'Dry Fruits', 2, '2025-02-20 23:55:53', '2025-02-21 21:11:52'),
(4, 'Fruits', 1, '2025-02-21 21:12:05', '2025-02-21 21:12:07');

-- --------------------------------------------------------

--
-- Table structure for table `nutrition_detail`
--

CREATE TABLE `nutrition_detail` (
  `nutrition_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(75) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 0 = inactive, 2 = deleted',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nutrition_detail`
--

INSERT INTO `nutrition_detail` (`nutrition_id`, `item_id`, `name`, `status`, `created_date`, `modify_date`) VALUES
(1, 1, '12', 1, '2025-03-03 01:20:38', '2025-03-04 02:15:26'),
(2, 1, '2', 2, '2025-03-03 01:20:38', '2025-03-03 01:20:49'),
(3, 1, '1', 2, '2025-03-03 01:20:38', '2025-03-03 01:20:46'),
(4, 1, '2', 1, '2025-03-03 01:20:38', '2025-03-03 01:20:38');

-- --------------------------------------------------------

--
-- Table structure for table `offer_detail`
--

CREATE TABLE `offer_detail` (
  `offer_id` int(11) NOT NULL,
  `offer_name` varchar(100) NOT NULL DEFAULT '',
  `offer_description` varchar(1000) NOT NULL DEFAULT '',
  `type` int(1) NOT NULL DEFAULT 1 COMMENT '1 = Category Wise, 2 = Items Wise',
  `offer_type` int(1) NOT NULL DEFAULT 1 COMMENT '1 = Per, 2 = BuyGet',
  `buy_unit_id` int(11) NOT NULL DEFAULT 0,
  `buy_qty` varchar(20) NOT NULL DEFAULT '0',
  `get_qty` varchar(20) NOT NULL DEFAULT '0',
  `get_unit_id` int(11) NOT NULL DEFAULT 0,
  `cat_id` int(11) NOT NULL DEFAULT 0,
  `item_id` int(11) NOT NULL DEFAULT 0,
  `offer_value` varchar(4) NOT NULL DEFAULT '0' COMMENT 'Per(%)',
  `start_date` datetime NOT NULL DEFAULT current_timestamp(),
  `end_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '1 = active, 2 = deleted, 0= inactive',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offer_detail`
--

INSERT INTO `offer_detail` (`offer_id`, `offer_name`, `offer_description`, `type`, `offer_type`, `buy_unit_id`, `buy_qty`, `get_qty`, `get_unit_id`, `cat_id`, `item_id`, `offer_value`, `start_date`, `end_date`, `status`, `created_date`, `modify_date`) VALUES
(1, 'O', '10%', 1, 1, 0, '', '', 0, 4, 0, '10', '2025-03-11 00:00:00', '2025-03-13 00:00:00', 2, '2025-03-10 23:42:48', '2025-03-11 23:14:52'),
(2, 'o2', '2 buy get 1', 1, 2, 4, '1', '2', 4, 4, 0, '0', '2025-03-12 00:00:00', '2025-03-16 00:00:00', 2, '2025-03-10 23:43:40', '2025-03-11 23:14:58'),
(3, 'Offer1', 'Offer 15% off buy any fruit', 1, 1, 0, '', '', 0, 4, 0, '15', '2025-03-14 18:30:00', '2025-03-16 18:30:00', 0, '2025-03-10 23:44:35', '2025-03-12 20:38:41'),
(4, 'offer2', '2 buy fruit & get 1 ', 1, 2, 4, '2', '1', 4, 4, 0, '0', '2025-03-12 00:00:00', '2025-03-15 00:00:00', 0, '2025-03-10 23:45:20', '2025-03-10 23:45:20'),
(5, 'Offer Apple', '20%', 2, 1, 0, '', '', 0, 0, 1, '20', '2025-03-20 00:00:00', '2025-03-21 00:00:00', 0, '2025-03-10 23:46:31', '2025-03-10 23:46:31');

-- --------------------------------------------------------

--
-- Table structure for table `order_detail`
--

CREATE TABLE `order_detail` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `delivery_boy_id` int(11) NOT NULL DEFAULT 0,
  `payment_type` int(1) NOT NULL DEFAULT 1 COMMENT '1 = COD, 2 = Online',
  `payment_status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = Waiting, 1 = Success, 2 = Fail',
  `address` varchar(250) NOT NULL DEFAULT '',
  `lati` varchar(25) NOT NULL DEFAULT '0.0',
  `longi` varchar(25) NOT NULL DEFAULT '0.0',
  `zip_code` varchar(15) NOT NULL DEFAULT '',
  `total_order_amount` varchar(25) NOT NULL DEFAULT '0.0',
  `offer_order_amount` varchar(25) NOT NULL DEFAULT '0.0',
  `delivery_amount` varchar(25) NOT NULL DEFAULT '0.0',
  `user_pay_order_amount` varchar(25) NOT NULL DEFAULT '0.0',
  `status` int(2) NOT NULL DEFAULT 0 COMMENT '0 = New Order, 1 = Order Process, 2 = Assign Delivery Boy, 3 = Out for Delivery, 4 = Delivered, 6  = Cancel',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_detail`
--

INSERT INTO `order_detail` (`order_id`, `user_id`, `delivery_boy_id`, `payment_type`, `payment_status`, `address`, `lati`, `longi`, `zip_code`, `total_order_amount`, `offer_order_amount`, `delivery_amount`, `user_pay_order_amount`, `status`, `created_date`, `modify_date`) VALUES
(1, 2, 3, 1, 0, 'Vivekanand Bridge, Vivekanand Bridge, Katargam,Surat', '21.19381051595097', '72.81505183077631', '395001', '30', '0', '0', '30', 3, '2025-04-03 23:42:34', '2025-04-29 09:49:20');

-- --------------------------------------------------------

--
-- Table structure for table `order_item_detail`
--

CREATE TABLE `order_item_detail` (
  `item_order_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL DEFAULT 0,
  `cart_id` int(11) NOT NULL DEFAULT 0,
  `price_id` int(11) NOT NULL DEFAULT 0,
  `offer_id` int(11) NOT NULL DEFAULT 0,
  `total_amount` varchar(25) NOT NULL DEFAULT '0.0',
  `offer_amount` varchar(25) NOT NULL DEFAULT '0.0',
  `pay_amount` varchar(25) NOT NULL DEFAULT '0.0',
  `reason` varchar(500) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = New Order, 1 = Order Accept, 2= Wait for Delivery, 3 = Out for Delivery, 4 = Done, 5 = Cancel, 6 = Delivery Boy Cancel, 7 = Order Reject.',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_item_detail`
--

INSERT INTO `order_item_detail` (`item_order_id`, `order_id`, `cart_id`, `price_id`, `offer_id`, `total_amount`, `offer_amount`, `pay_amount`, `reason`, `status`, `created_date`, `modify_date`) VALUES
(1, 1, 3, 2, 0, '30', '0', '30', '', 3, '2025-04-03 23:42:34', '2025-04-29 09:49:20');

-- --------------------------------------------------------

--
-- Table structure for table `order_status_detail`
--

CREATE TABLE `order_status_detail` (
  `order_status_id` int(11) NOT NULL,
  `order_id` int(9) NOT NULL DEFAULT 0,
  `item_order_id` int(11) NOT NULL DEFAULT 0,
  `order_status` int(2) NOT NULL DEFAULT 0,
  `latitude` varchar(30) NOT NULL DEFAULT '0.0',
  `longitude` varchar(30) NOT NULL DEFAULT '0.0',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_status_detail`
--

INSERT INTO `order_status_detail` (`order_status_id`, `order_id`, `item_order_id`, `order_status`, `latitude`, `longitude`, `created_date`, `status`) VALUES
(1, 0, 1, 1, '0.0', '0.0', '2025-04-17 22:32:54', 1),
(2, 1, 0, 3, '0.0', '0.0', '2025-04-29 09:49:20', 1);

-- --------------------------------------------------------

--
-- Table structure for table `price_detail`
--

CREATE TABLE `price_detail` (
  `price_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL DEFAULT 0,
  `unit_id` int(11) NOT NULL DEFAULT 0,
  `amount` varchar(25) NOT NULL DEFAULT '0.0',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 0 = inactive, 2 = deleted',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `price_detail`
--

INSERT INTO `price_detail` (`price_id`, `item_id`, `unit_id`, `amount`, `status`, `created_date`, `modify_date`) VALUES
(1, 1, 4, '5', 2, '2025-03-04 21:25:48', '2025-03-04 21:26:49'),
(2, 1, 2, '10', 1, '2025-03-04 21:27:27', '2025-03-04 21:27:27'),
(3, 1, 3, '6', 1, '2025-03-04 21:27:38', '2025-03-04 21:27:38');

-- --------------------------------------------------------

--
-- Table structure for table `review_detail`
--

CREATE TABLE `review_detail` (
  `rate_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL DEFAULT 0,
  `item_order_id` int(11) NOT NULL DEFAULT 0,
  `rate` decimal(10,0) NOT NULL DEFAULT 5,
  `message` varchar(500) NOT NULL DEFAULT '',
  `user_id` int(11) NOT NULL DEFAULT 0,
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = Active, 2 = Deleted',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `unit_detail`
--

CREATE TABLE `unit_detail` (
  `unit_id` int(11) NOT NULL,
  `unit_name` varchar(25) NOT NULL DEFAULT '',
  `unit_value` varchar(10) NOT NULL DEFAULT '1000',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = inactive, 1 = active',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `unit_detail`
--

INSERT INTO `unit_detail` (`unit_id`, `unit_name`, `unit_value`, `status`, `created_date`, `modify_date`) VALUES
(1, 'KG', '1000', 2, '2025-02-23 01:06:23', '2025-02-23 01:08:54'),
(2, 'KG', '1', 0, '2025-02-23 01:09:07', '2025-02-23 01:09:07'),
(3, '500G', '500', 0, '2025-02-23 01:09:18', '2025-02-23 01:09:18'),
(4, 'pcs', '1', 0, '2025-02-23 01:09:44', '2025-02-23 01:09:53'),
(5, 'box', '12 pcs', 0, '2025-02-23 01:10:05', '2025-02-23 01:10:05');

-- --------------------------------------------------------

--
-- Table structure for table `user_detail`
--

CREATE TABLE `user_detail` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `mobile_code` varchar(5) NOT NULL DEFAULT '+91',
  `mobile` varchar(15) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL DEFAULT '',
  `os_type` varchar(10) NOT NULL DEFAULT 'i' COMMENT 'i =iOS, a = android',
  `push_token` varchar(36) NOT NULL DEFAULT '',
  `auth_token` varchar(100) NOT NULL DEFAULT '',
  `otp_code` varchar(6) NOT NULL DEFAULT '000000',
  `user_type` int(2) NOT NULL DEFAULT 1 COMMENT '1 = User, 2 = Delivery Boy, 3= Shop Owner Admin',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '0 = Block, 1 = active, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_detail`
--

INSERT INTO `user_detail` (`user_id`, `name`, `mobile_code`, `mobile`, `email`, `os_type`, `push_token`, `auth_token`, `otp_code`, `user_type`, `status`, `created_date`, `modify_date`) VALUES
(1, '', '+91', '9876543210', '', 'i', '', 'ZuhtKDSVTn8OQjg4esLB', '402371', 3, 1, '2025-02-16 23:45:46', '2025-04-09 00:32:35'),
(2, '', '+91', '9876543211', '', 'i', '', 'pbbETdaNtaUs38V0DrR5', '316621', 1, 1, '2025-02-18 21:51:43', '2025-04-03 23:15:30'),
(3, 'Delivery Boy 1', '+91', '9876543212', 'delivery@gmail.com', 'i', '', 'CWIIUIaXcSdVhNpUXSyI', '943099', 2, 1, '2025-04-20 22:20:22', '2025-04-28 09:12:13'),
(4, 'Delivery Boy 2', '+91', '9876543213', 'deliveryboy2@gmail.com', 'i', '', '', '000000', 2, 1, '2025-04-22 08:01:20', '2025-04-22 08:01:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address_detail`
--
ALTER TABLE `address_detail`
  ADD PRIMARY KEY (`address_id`);

--
-- Indexes for table `cart_detail`
--
ALTER TABLE `cart_detail`
  ADD PRIMARY KEY (`cart_id`);

--
-- Indexes for table `category_detail`
--
ALTER TABLE `category_detail`
  ADD PRIMARY KEY (`cat_id`);

--
-- Indexes for table `item_detail`
--
ALTER TABLE `item_detail`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `location_detail`
--
ALTER TABLE `location_detail`
  ADD PRIMARY KEY (`location_id`);

--
-- Indexes for table `main_category`
--
ALTER TABLE `main_category`
  ADD PRIMARY KEY (`main_cat_id`);

--
-- Indexes for table `nutrition_detail`
--
ALTER TABLE `nutrition_detail`
  ADD PRIMARY KEY (`nutrition_id`);

--
-- Indexes for table `offer_detail`
--
ALTER TABLE `offer_detail`
  ADD PRIMARY KEY (`offer_id`);

--
-- Indexes for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `order_item_detail`
--
ALTER TABLE `order_item_detail`
  ADD PRIMARY KEY (`item_order_id`);

--
-- Indexes for table `order_status_detail`
--
ALTER TABLE `order_status_detail`
  ADD PRIMARY KEY (`order_status_id`);

--
-- Indexes for table `price_detail`
--
ALTER TABLE `price_detail`
  ADD PRIMARY KEY (`price_id`);

--
-- Indexes for table `review_detail`
--
ALTER TABLE `review_detail`
  ADD PRIMARY KEY (`rate_id`);

--
-- Indexes for table `unit_detail`
--
ALTER TABLE `unit_detail`
  ADD PRIMARY KEY (`unit_id`);

--
-- Indexes for table `user_detail`
--
ALTER TABLE `user_detail`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address_detail`
--
ALTER TABLE `address_detail`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart_detail`
--
ALTER TABLE `cart_detail`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `category_detail`
--
ALTER TABLE `category_detail`
  MODIFY `cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `item_detail`
--
ALTER TABLE `item_detail`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `location_detail`
--
ALTER TABLE `location_detail`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `main_category`
--
ALTER TABLE `main_category`
  MODIFY `main_cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `nutrition_detail`
--
ALTER TABLE `nutrition_detail`
  MODIFY `nutrition_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `offer_detail`
--
ALTER TABLE `offer_detail`
  MODIFY `offer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_item_detail`
--
ALTER TABLE `order_item_detail`
  MODIFY `item_order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_status_detail`
--
ALTER TABLE `order_status_detail`
  MODIFY `order_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `price_detail`
--
ALTER TABLE `price_detail`
  MODIFY `price_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `review_detail`
--
ALTER TABLE `review_detail`
  MODIFY `rate_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `unit_detail`
--
ALTER TABLE `unit_detail`
  MODIFY `unit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_detail`
--
ALTER TABLE `user_detail`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
