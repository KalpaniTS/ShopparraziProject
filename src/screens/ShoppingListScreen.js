import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useShoppingList } from '../context/ShoppingListContext';

const ShoppingListScreen = () => {
  const navigation = useNavigation();
  const { shoppingList, updateQuantity, removeFromShoppingList } = useShoppingList();

  const handleRemoveProduct = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => removeFromShoppingList(productId),
          style: 'destructive',
        },
      ]
    );
  };

  const handleComparePrice = () => {
    navigation.navigate('ComparePriceScreen', { shoppingList });
  };

  const handleContinueShopping = () => {
    navigation.navigate('Explore');
  };

  const handleSaveShoppingList = () => {
    Alert.alert('Shopping List Saved', 'Your shopping list has been saved.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Shopping List</Text>
      {shoppingList.map((item, index) => (
        <View key={item.id} style={styles.productItem}>
          <Image source={{ uri: item.image_url }} style={styles.productImage} />
          <View style={styles.productInfoContainer}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>{item.name}</Text>
              <TouchableOpacity
                style={styles.deleteButtonContainer}
                onPress={() => handleRemoveProduct(item.id)}
              >
                <Ionicons name="trash" size={30} color="red" />
              </TouchableOpacity>
            </View>
            <Text style={styles.quantityLabel}>{item.volume}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Ionicons name="remove" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Ionicons name="add" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.fullWidth]}
          onPress={handleSaveShoppingList}
        >
          <Text style={styles.buttonText}>Save Shopping List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.fullWidth]}
          onPress={handleComparePrice}
        >
          <Text style={styles.buttonText}>Compare Price</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.fullWidth]}
          onPress={handleContinueShopping}
        >
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF006B',
    marginBottom: 20,
  },
  productItem: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  productInfoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  productImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
    marginTop: 20,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 50,
  },
  quantityLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 20,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 5,
    marginHorizontal: 10,
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#FF006B',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginVertical: 7,
    alignItems: 'center',
  },
  fullWidth: {
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButtonContainer: {
    position: 'absolute',
    right: 30,
    top: 0,
  },
});

export default ShoppingListScreen;
