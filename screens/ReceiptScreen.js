import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import { database } from '../firebase/app/firebaseConfig';
import Header from '../components/header/PageHeader';
import { globalStyles } from '../styles/global';

const ReceiptScreen = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const numberOfItemsPerPageList = [15, 30, 45];

  useEffect(() => {
    const receiptsRef = database.ref('receipts');
    
    const handleReceipts = (snapshot) => {
      const receiptsArray = [];
      snapshot.forEach(childSnapshot => {
        const receipt = childSnapshot.val();
        receiptsArray.push(receipt);
      });
      setReceipts(receiptsArray);
    };

    // Attach the listener
    receiptsRef.on('value', handleReceipts);

    // Cleanup listener on unmount
    return () => receiptsRef.off('value', handleReceipts);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemRow} onPress={() => { setSelectedReceipt(item); setModalVisible(true); }}>
      <Text style={styles.itemCell}>Receipt #{item.id}</Text>
      <Text style={styles.itemCell}>Total: ${item.total.toFixed(2)}</Text>
      <Text style={styles.itemCell}>Date: {new Date(item.timestamp).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Receipts" noBack />
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Receipt ID</DataTable.Title>
          <DataTable.Title>Total</DataTable.Title>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        {receipts.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((item) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell>Receipt #{item.id}</DataTable.Cell>
            <DataTable.Cell>${item.total.toFixed(2)}</DataTable.Cell>
            <DataTable.Cell>{new Date(item.timestamp).toLocaleString()}</DataTable.Cell>
            <DataTable.Cell>
              <Button mode="contained" onPress={() => { setSelectedReceipt(item); setModalVisible(true); }} style={styles.actionButton}>View</Button>
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(receipts.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${page * itemsPerPage + 1}-${Math.min((page + 1) * itemsPerPage, receipts.length)} of ${receipts.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
        />
      </DataTable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedReceipt && (
              <>
                <Text style={styles.modalTitle}>Receipt #{selectedReceipt.id}</Text>
                <Text style={styles.modalText}>Total: ${selectedReceipt.total.toFixed(2)}</Text>
                <Text style={styles.modalText}>Date: {new Date(selectedReceipt.timestamp).toLocaleString()}</Text>
                <Text style={styles.modalText}>Items:</Text>
                {selectedReceipt.items.map((item, index) => (
                  <Text key={index} style={styles.modalText}>
                    {item.name} - {item.category} - ${item.price.toFixed(2)} x {item.quantity}
                  </Text>
                ))}
                <Text style={styles.modalText}>
                  Customer Money: ${selectedReceipt.payment.customerMoney.toFixed(2)}
                </Text>
                <Text style={styles.modalText}>
                  Change: ${selectedReceipt.payment.change.toFixed(2)}
                </Text>
                <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  Close
                </Button>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#978A84', // Updated background color
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
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontFamily: 'sans-serif-medium',
  },
  modalText: {
    marginBottom: 10,
  },
  actionButton: {
    marginLeft: 50,
  },
  closeButton: {
    marginTop: 20,
  },
});
export default ReceiptScreen;