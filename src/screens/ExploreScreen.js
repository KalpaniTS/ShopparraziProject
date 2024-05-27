import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useShoppingList } from "../context/ShoppingListContext";

const ExploreScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState({});
  const { addToShoppingList } = useShoppingList();

  const { searchText = "" } = route.params || {};

  useEffect(() => {
    console.log('Fetching products...');
    axios.get('http://192.168.1.122:3001/products') // Replace with your machine's IP address
      .then(response => {
        console.log('Products fetched:', response.data);
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddToList = (product) => {
    const productQuantity = quantity[product.id] || 0;
    addToShoppingList(product, productQuantity);
    console.log('Adding to list:', product, 'Quantity:', productQuantity);
    navigation.navigate("ShoppingList");
  };

  const increaseQuantity = (productId) => {
    setQuantity(prevQuantity => ({
      ...prevQuantity,
      [productId]: (prevQuantity[productId] || 0) + 1,
    }));
  };

  const decreaseQuantity = (productId) => {
    setQuantity(prevQuantity => ({
      ...prevQuantity,
      [productId]: Math.max((prevQuantity[productId] || 0) - 1, 0),
    }));
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF006B" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Product Details</Text>
      {filteredProducts.map((product, index) => (
        <View key={product.id} style={styles.productItem}>
          {product.image_url && (
            <Image source={{ uri: product.image_url }} style={styles.productImage} />
          )}
          {product.name && (
            <Text style={styles.productName}>{product.name}</Text>
          )}
          {product.volume && (
            <Text style={styles.productVolume}>{product.volume}</Text>
          )}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <TouchableOpacity onPress={() => decreaseQuantity(product.id)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonLabel}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              value={(quantity[product.id] || 0).toString()}
              editable={false}
            />
            <TouchableOpacity onPress={() => increaseQuantity(product.id)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonLabel}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddToList(product)}>
            <Text style={styles.addButtonLabel}>Add to List</Text>
          </TouchableOpacity>
          {index < filteredProducts.length - 1 && (
            <View style={styles.separator} />
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF006B",
    marginBottom: 20,
  },
  productItem: {
    alignItems: "center",
    marginBottom: 20,
    width: '100%',
  },
  productImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    borderRadius: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  productVolume: {
    fontSize: 16,
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 60,
    textAlign: "center",
    marginHorizontal: 10,
  },
  quantityButton: {
    backgroundColor: "#FF006B",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  quantityButtonLabel: {
    color: "#fff",
    fontSize: 20,
  },
  addButton: {
    backgroundColor: "#FF006B",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 10,
  },
  addButtonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    width: '90%',
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
});

export default ExploreScreen;
