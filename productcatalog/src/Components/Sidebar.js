import React, { useEffect, useState } from "react";
import {
  CardContent,
  CardMedia,
  CardActionArea,
  Box,
  Container,
  Grid,
  Typography,
  Card,
  Button,
  keyframes,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import table from "../Images/table.jpg";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const moveUpAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-50px);
  }
  100% {
    transform: translateY(0);
  }
`;
function Sidebar({ searchQuery }) {
  const [productCategories, setProductCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [visibleProductIndex, setVisibleProductIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [likedProducts, setLikedProducts] = useState({});
  const [isAdded, setIsAdded] = useState({}); // State to track if item is added to cart
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddToCart = (productId) => {
    setIsAdded((prevIsAdded) => ({
      ...prevIsAdded,
      [productId]: true, // Set the specific product's state to true
    }));

    setTimeout(() => {
      setIsAdded((prevIsAdded) => ({
        ...prevIsAdded,
        [productId]: false, // Reset the specific product's state after 2 seconds
      }));
    }, 2000);
  };

  const handleLike = (productId) => {
    setLikedProducts((prevLikedProducts) => ({
      ...prevLikedProducts,
      [productId]: !prevLikedProducts[productId],
    }));
  };

  // Fetch all products when the component mounts
  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.products)) {
          setAllProducts(data.products);
          setProducts(data.products);
          setCurrentPage(1); // Reset to the first page
        } else {
          console.error(
            "Fetched data does not contain an array of products:",
            data
          );
        }
      })
      .catch((error) => console.error("Error fetching products", error));
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((response) => response.json())
      .then((data) => setProductCategories(data))
      .catch((error) => console.error("Error fetching categories", error));
  }, []);

  // Fetch products for a specific category
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "All Products") {
      fetch(`https://dummyjson.com/products/category/${selectedCategory.slug}`)
        .then((response) => response.json())
        .then((data) => {
          setProducts(data.products);
          setCurrentPage(1);
        })
        .catch((error) => console.error("Error fetching products", error));
    }
  }, [selectedCategory]);

  // Set all products when "All Products" is selected
  useEffect(() => {
    if (selectedCategory === "All Products") {
      setProducts(allProducts);
    }
  }, [allProducts, selectedCategory]);

  const fetchAllProducts = () => {
    setSelectedCategory("All Products");
    fetchProducts("https://dummyjson.com/products");
  };

  const fetchProducts = (url) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok (status ${response.status})`
          );
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.products)) {
          setAllProducts(data.products);
          setVisibleProductIndex(0);
          setCurrentPage(1);
        } else {
          console.error(
            "Fetched data does not contain an array of products:",
            data
          );
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <Box
      sx={{
        marginTop: { md: "60px", xs: "55px" },

        position: "fixed",
        display: "flex",
        backgroundImage: `url(${table})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 0,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backdropFilter: "blur(8px)",
          zIndex: -1,
        },
      }}
    >
      <Container
        sx={{
          backgroundColor: {
            xs: expanded ? "#D9C2AD" : "rgba(255, 255, 250, 0.2)", // Solid background color for small screens
            sm: "rgba(255, 255, 250, 0.2)", // Solid background color for small screens
            md: "rgba(255, 255, 250, 0.2)", // Transparent background for larger screens
          },
          width: { xs: expanded ? "200px" : "20px", sm: "40%", md: "20%" },
          minWidth: 0, // Ensure it can shrink below default width
          margin: 0,
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          zIndex: { xs: 2, md: 1 },
          boxSizing: "border-box",

          "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar
          "-ms-overflow-style": "none", // Hide scrollbar in IE
          "scrollbar-width": "none", // Hide scrollbar in Firefox
          position: { xs: "absolute", md: "relative", sm: "relative" }, // Position absolute for small screens
          transition: "width 0.3s ease",
        }}
      >
        <Grid container direction="column" sx={{ flexWrap: "nowrap" }}>
          {/* Toggle Sidebar Icon */}
          {isSmallScreen && (
            <IconButton
              onClick={toggleSidebar}
              sx={{
                position: "fixed",
                top: "52%", // Center vertically
                transform: "translateY(-50%)",
                right: expanded ? "33%" : "85%",
                backgroundColor: "#fff",
                borderRadius: "50%", // Full circular button
                boxShadow: 2,
                zIndex: 1,
                zIndex: 3,
                width: "35px", // Define explicit width and height for the button
                height: "35px",
                overflow: "visible", // Ensure the button is not clipped
                transition: "right 0.3s ease",
              }}
            >
              {expanded ? (
                <KeyboardArrowLeftIcon />
              ) : (
                <KeyboardArrowRightIcon />
              )}
            </IconButton>
          )}
          {/* "All Products" Button */}
          <Grid
            item
            sx={{
              marginTop: "15px",
              marginBottom: "10px",
              marginLeft: expanded ? 0 : 2,
              backgroundColor: "rgba(255, 255, 250, 0.2)",
              borderRadius: 2,
              boxShadow: 1,
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
              left: 0,
              right: 0,
              padding: "5px",
              cursor: "pointer",
            }}
            onClick={() => {
              fetchAllProducts();
              if (isSmallScreen && expanded) {
                toggleSidebar(); // Close the sidebar on small screens after selecting category
              }
            }}
          >
            <Typography variant="h6" noWrap>
              All Products
            </Typography>
          </Grid>

          {/* Categories List */}
          <Grid item>
            {productCategories.map((category, index) => (
              <Typography
                key={index}
                sx={{
                  color: selectedCategory === category ? "black" : "black",
                  padding: 1.5,
                  paddingLeft: { xs: 2 },
                  cursor: "pointer",
                  backgroundColor:
                    selectedCategory === category
                      ? "rgba(255, 255, 250, 0.5)"
                      : "transparent",

                  borderRadius:
                    selectedCategory === category ? "20px 0 0 20px" : "0",
                  transition: "all 0.3s ease",
                  width: "calc(100% + 20px)",
                  marginLeft: {
                    xs: "0", // No margin on extra small screens
                    sm: selectedCategory === category ? "-10px" : "0", // Apply margin logic for other screen sizes
                  },
                  alignItems: "center",
                  whiteSpace: "nowrap", // Prevent text wrapping
                  textOverflow: "ellipsis", // Add ellipsis if the text is too long
                  overflow: "hidden", // Hide overflowing text
                  flexShrink: 1, // Allow shrinking of the text
                  "&:hover": {
                    backgroundColor:
                      selectedCategory === category ? "#f0f0f0" : "#e0e0e0",
                    borderRadius: "20px 0 0 20px",
                  },
                }}
                onClick={() => {
                  setSelectedCategory(category); // Set selected category
                  if (isSmallScreen && expanded) {
                    toggleSidebar(); // Close the sidebar on small screens after selecting category
                  }
                }}
              >
                {category.name}
              </Typography>
            ))}
          </Grid>
        </Grid>
      </Container>

      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1,
          padding: 2,
          height: "100vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        {paginatedProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                marginTop: { xs: "10px" },
                marginLeft: { xs: "30px" },
                maxWidth: { md: 325, xs: 300 },
                backgroundColor: "rgba(255, 255, 250, 0.2)",
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardActionArea
                sx={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    height: { xs: 200, sm: 150, md: 200 },
                    objectFit: "cover",
                  }}
                  image={product.thumbnail}
                  alt={product.title}
                />
                <CardContent
                  sx={{
                    padding: "16px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "200px",
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
                  >
                    {product.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: "8px", flexGrow: 1 }}
                  >
                    {product.description}
                  </Typography>
                  <Typography sx={{ fontSize: "1rem", fontWeight: "medium" }}>
                    Price: ${product.price}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      color: "text.primary",
                      marginTop: "4px",
                    }}
                  >
                    Rating: {product.rating}⭐
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px", // Space between icon and button
                        padding: "8px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(255, 255, 250, 0.2)",
                      }}
                    >
                      <ShoppingCartIcon
                        sx={{
                          animation: isAdded[product.id]
                            ? `${moveUpAnimation} 0.7s ease`
                            : "none", // Apply animation when added
                          color: isAdded[product.id] ? "green" : "inherit",
                          transition: "color 0.3s ease", // Smooth transition for color change
                        }}
                      />
                      <Button
                        onClick={() => handleAddToCart(product.id)}
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          color: isAdded[product.id] ? "green" : "white",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {isAdded[product.id] ? "Added" : "Add To Cart"}
                      </Button>
                    </Typography>

                    <Button
                      onClick={() => handleLike(product.id)} // Pass the product.id to handleLike
                      sx={{
                        color: likedProducts[product.id] ? "red" : "inherit", // Conditionally set color
                      }}
                    >
                      <FavoriteIcon />
                    </Button>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}

        {/* Pagination Controls for "All Products" */}

        {selectedCategory === "All Products" && (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
              marginTop: 2,
              position: "fixed",
              bottom: 10,
              left: { md: 50, sm: 50 },
              right: 0,
            }}
          >
            <Button
              variant="contained"
              sx={{
                marginRight: 2,
                backgroundColor: "#00aaff", // Custom button color
                color: "white", // White text for contrast
                borderRadius: "20px", // Rounded button edges
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Button shadow
                "&:hover": {
                  backgroundColor: "#0088cc", // Slightly darker on hover
                  transform: "scale(1.05)", // Scale the button up slightly on hover
                },
                "&:disabled": {
                  backgroundColor: "#888888", // Gray for disabled state
                },
              }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Typography
              variant="body1"
              sx={{
                marginRight: 2,
                color: "#f5f5f5", // Slightly off-white for a softer contrast
                fontWeight: "bold", // Bold text for emphasis
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" }, // Responsive font size
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background for contrast
                padding: "8px 12px", // Add padding for better spacing around the text
                borderRadius: "50px", // Smooth rounded corners for a modern look
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
                textAlign: "center", // Center-align the text
                display: "inline-block", // Ensure it's inline for responsive handling
                whiteSpace: "nowrap", // Prevent the text from wrapping
              }}
            >
              {currentPage}
            </Typography>

            <Button
              variant="contained"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              sx={{
                backgroundColor: "#00aaff",
                color: "white",
                borderRadius: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor: "#0088cc",
                  transform: "scale(1.05)",
                },
                "&:disabled": {
                  backgroundColor: "#888888",
                },
              }}
            >
              Next
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Sidebar;
