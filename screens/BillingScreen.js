import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Modal, Image, Alert } from 'react-native';
import { TextInput, Button, Searchbar, DataTable, Checkbox } from 'react-native-paper';
import { database } from '../firebase/app/firebaseConfig';
import Header from '../components/header/PageHeader';
import { globalStyles } from '../styles/global';

const BillingScreen = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [customerMoney, setCustomerMoney] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const numberOfItemsPerPageList = [5, 10, 15];

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const getItems = () => {
    database.ref('items').once('value')
      .then(snapshot => {
        const itemsArray = [];
        snapshot.forEach(childSnapshot => {
          const item = childSnapshot.val();
          itemsArray.push({ ...item, price: parseFloat(item.price) });
        });
        setItems(itemsArray);
      });
  };

  const addToReceipt = (item, quantity) => {
    if (!item.available) {
      Alert.alert('Item Not Available', 'This item is currently not available.');
      return;
    }
    
    const existingItemIndex = selectedItems.findIndex(selectedItem => selectedItem.id === item.id);
    if (existingItemIndex > -1) {
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems[existingItemIndex].quantity += quantity;
      setSelectedItems(updatedSelectedItems);
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity }]);
    }
  };

  const removeFromReceipt = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  useEffect(() => {
    const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [selectedItems]);

  const confirmReceipt = () => {
    setPaymentModalVisible(true);
  };

  const handlePaymentConfirmation = () => {
    if (customerMoney >= totalPrice) {
      const receiptId = new Date().getTime();
      const changeAmount = parseFloat(customerMoney) - totalPrice;
      const receiptData = {
        id: receiptId,
        items: selectedItems,
        total: totalPrice,
        timestamp: new Date().toISOString(),
        dateCreated: new Date().toLocaleString(),
        payment: {
          customerMoney: parseFloat(customerMoney),
          change: changeAmount
        }
      };

      database.ref('receipts/' + receiptId).set(receiptData)
        .then(() => {
          setSelectedItems([]);
          setTotalPrice(0);
          setPaymentModalVisible(false);
          Alert.alert('Payment Confirmed', `The change to be returned is PHP${changeAmount.toFixed(2)}`);
        })
        .catch(err => {
          console.log({ err });
        });
    } else {
      alert("Insufficient payment! Please provide enough money.");
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header title="Billing" noBack />
      <ScrollView>
        <View style={[globalStyles.screenPadding]}>

          {/* Selected Items Section */}
          <View style={[globalStyles.mt20, styles.selectedItemsBox]}>
            <Text style={styles.tableHeader}>Selected Items:</Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Category</DataTable.Title>
                <DataTable.Title numeric>Price</DataTable.Title>
                <DataTable.Title numeric>Quantity</DataTable.Title>
                <DataTable.Title numeric>Total</DataTable.Title>
                <DataTable.Title numeric>Actions</DataTable.Title>
              </DataTable.Header>

              {selectedItems.map((item) => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>{item.name}</DataTable.Cell>
                  <DataTable.Cell>{item.category}</DataTable.Cell>
                  <DataTable.Cell numeric>PHP{item.price.toFixed(2)}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                  <DataTable.Cell numeric>PHP{(item.price * item.quantity).toFixed(2)}</DataTable.Cell>
                  <DataTable.Cell>
                    <Button mode="contained" onPress={() => removeFromReceipt(item.id)} style={styles.actionButton}>Remove</Button>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
            <Text style={[globalStyles.mt10, styles.totalPriceText]}>Total Price: PHP{totalPrice.toFixed(2)}</Text>
            {selectedItems.length > 0 && (
              <Button mode="contained" onPress={confirmReceipt} style={globalStyles.mt10}>
                Confirm Receipt
              </Button>
            )}
          </View>

          {/* Items List Section */}
          <View style={[globalStyles.mt20]}>
            <Text style={styles.tableHeader}>Items List:</Text>
            <Searchbar
              placeholder="Search items..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Image</DataTable.Title>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Category</DataTable.Title>
                <DataTable.Title>Price</DataTable.Title>
                <DataTable.Title>Available</DataTable.Title>
              </DataTable.Header>

              {filteredItems.slice(from, to).map((item) => (
                <DataTable.Row key={item.id} onPress={() => addToReceipt(item, 1)}>
                  <DataTable.Cell>
                    <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                  </DataTable.Cell>
                  <DataTable.Cell>{item.name}</DataTable.Cell>
                  <DataTable.Cell>{item.category}</DataTable.Cell>
                  <DataTable.Cell>PHP{item.price.toFixed(2)}</DataTable.Cell>
                  <DataTable.Cell>
                    <Checkbox
                      status={item.available ? 'checked' : 'unchecked'}
                      disabled
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(filteredItems.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${filteredItems.length}`}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                showFastPaginationControls
                selectPageDropdownLabel={'Rows per page'}
              />
            </DataTable>
          </View>
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Payment</Text>
            <Text style={styles.modalText}>Total Price: PHP{totalPrice.toFixed(2)}</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Enter amount from customer</Text>
              <TextInput
                mode="outlined"
                label="Customer Money"
                dense
                keyboardType="numeric"
                value={customerMoney}
                onChangeText={setCustomerMoney}
                style={styles.staticHeightInput}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button mode="contained" onPress={handlePaymentConfirmation}>
                Confirm Payment
              </Button>
              <Button mode="contained" onPress={() => setPaymentModalVisible(false)}>
                Close
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BillingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#978A84', // Soft blue background color for the entire app
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  staticHeightInput: {
    height: 50, // Fixed height for text inputs
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontFamily: 'sans-serif-medium',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'sans-serif-medium',
  },
  searchInput: {
    marginBottom: 20,
    fontFamily: 'sans-serif-medium',
  },
  label: {
    marginBottom: 5,
    fontFamily: 'sans-serif-medium',
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemCell: {
    flex: 1,
    fontFamily: 'sans-serif-medium',
  },
  headerCell: {
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
  },
  actionButton: {
    marginLeft: 10,
  },
  tableHeader: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'sans-serif-medium',
  },
  selectedItemsBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  totalPriceText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});
