import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Modal, Image, Alert } from 'react-native';
import { Appbar, Button, TextInput, DataTable, Checkbox } from 'react-native-paper';
import { globalStyles } from '../styles/global';
import { database, storage } from '../firebase/app/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Header from '../components/header/PageHeader';

const ItemScreen = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([]);
  const [updateId, setUpdateId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [available, setAvailable] = useState(false);
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

  const onAdd = async () => {
    const id = new Date().getTime();
    let imageUrl = "";
    if (image) {
      imageUrl = await uploadMedia();
    }

    database.ref('items/' + id).set({ id, name, category, price: parseFloat(price), imageUrl, available })
      .then(() => {
        resetForm();
        getItems();
        setModalVisible(false);
      })
      .catch(err => {
        console.log({ err });
      });
  };

  const onUpdate = async () => {
    let imageUrl = "";
    if (image) {
      imageUrl = await uploadMedia();
    }

    database.ref('items/' + updateId).update({ name, category, price: parseFloat(price), imageUrl, available })
      .then(() => {
        resetForm();
        getItems();
        setModalVisible(false);
      })
      .catch(err => {
        console.log({ err });
      });
  };

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

  const onDelete = (id) => {
    database.ref('items/' + id).remove()
      .then(() => {
        getItems();
      })
      .catch(err => {
        console.log({ err });
      });
  };

  const startUpdate = (item) => {
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price.toString());
    setImage(item.imageUrl || null);
    setAvailable(item.available || false);
    setUpdateId(item.id);
    setModalVisible(true);
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setImage(null);
    setAvailable(false);
    setUpdateId(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.4,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadMedia = async () => {
    setUploading(true);
    try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      const filename = image.substring(image.lastIndexOf('/') + 1);
      const ref = storage.ref().child(`images/${filename}`);

      const snapshot = await ref.put(blob);
      const downloadURL = await snapshot.ref.getDownloadURL();

      setUploading(false);
      return downloadURL;
    } catch (error) {
      console.log({ error });
      setUploading(false);
    }
  };

  const toggleAvailability = (id, currentStatus) => {
    database.ref('items/' + id).update({ available: !currentStatus })
      .then(() => {
        getItems();
      })
      .catch(err => {
        console.log({ err });
      });
  };

  return (
    <View style={styles.container}>
      <Header title="Items" noBack />
      <ScrollView>
        <View style={[globalStyles.screenPadding]}>
          <Button mode="contained" onPress={() => {
            resetForm();
            setModalVisible(true);
          }}>
            Add Item
          </Button>
          <View style={[globalStyles.mt20]}>
            <Text style={styles.tableHeader}>Items List:</Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Image</DataTable.Title>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Category</DataTable.Title>
                <DataTable.Title>Price</DataTable.Title>
                <DataTable.Title>Available</DataTable.Title>
                <DataTable.Title>Actions</DataTable.Title>
              </DataTable.Header>

              {items.slice(from, to).map((item) => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>
                    <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                  </DataTable.Cell>
                  <DataTable.Cell>{item.name}</DataTable.Cell>
                  <DataTable.Cell>{item.category}</DataTable.Cell>
                  <DataTable.Cell>${item.price.toFixed(2)}</DataTable.Cell>
                  <DataTable.Cell>
                    <Checkbox
                      status={item.available ? 'checked' : 'unchecked'}
                      onPress={() => toggleAvailability(item.id, item.available)}
                    />
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <View style={styles.buttonGroup}>
                      <Button mode="contained" onPress={() => startUpdate(item)} style={styles.actionButton}>Edit</Button>
                      <Button mode="contained" onPress={() => onDelete(item.id)} style={styles.actionButton}>Delete</Button>
                    </View>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(items.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${items.length}`}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{updateId ? "Update Item" : "Add Item"}</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                mode='outlined'
                label='Name'
                dense
                value={name}
                onChangeText={setName}
                style={styles.staticHeightInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                mode='outlined'
                label='Category'
                dense
                value={category}
                onChangeText={setCategory}
                style={styles.staticHeightInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                mode='outlined'
                label='Price'
                dense
                value={price}
                onChangeText={setPrice}
                keyboardType='numeric'
                style={styles.staticHeightInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Image</Text>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <Text>No image selected</Text>
              )}
              <Button mode="contained" onPress={pickImage} style={styles.pickImageButton}>
                Pick Image
              </Button>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Available</Text>
              <Checkbox
                status={available ? 'checked' : 'unchecked'}
                onPress={() => setAvailable(!available)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button mode="contained" onPress={updateId ? onUpdate : onAdd}>
                {updateId ? 'Update' : 'Add'}
              </Button>
              <Button mode="contained" onPress={() => setModalVisible(false)}>
                Close
              </Button>
            </View>
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
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  staticHeightInput: {
    height: 50, // Updated fixed height for text inputs
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
    alignItems: 'center',
  },
  itemCell: {
    flex: 1,
    paddingHorizontal: 5,
    fontFamily: 'sans-serif-medium',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  actionButton: {
    marginLeft: 5,
  },
  headerCell: {
    fontWeight: 'bold',
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
  tableHeader: {
    fontFamily: 'sans-serif-medium',
    fontSize: 18,
    marginBottom: 10,
  },
  pickImageButton: {
    marginTop: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default ItemScreen;
