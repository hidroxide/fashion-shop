--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `title`, `level`, `parent_id`) VALUES
(1, 'Áo Nam', 1, NULL),
(2, 'Quần Nam', 1, NULL),
(3, 'Nón Unisex', 1, NULL),
(4, 'Áo T-Shirt', 2, 1),
(5, 'Áo Polo', 2, 1),
(6, 'Áo Sơ Mi', 2, 1),
(7, 'Quần Short', 2, 2),
(8, 'Quần Jeans', 2, 2),
(9, 'Nón Kết', 2, 3),
(10, 'Nón Snapback', 2, 3),
(11, 'Nón Bucket', 2, 3);

--
-- Dumping data for table `colours`
--

INSERT INTO `colours` (`colour_id`, `colour_name`) VALUES
(1, 'Trắng'),
(2, 'Đen'),
(3, 'Xám');

--
-- Dumping data for table `sizes`
--

INSERT INTO `sizes` (`size_id`, `size_name`) VALUES
(1, 'S'),
(2, 'M'),
(3, 'L'),
(4, 'XL'),
(5, 'XXL'),
(6, '29'),
(7, '30'),
(8, '31'),
(9, '32'),
(10, '33');