import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';

const TodoListItem = ({ item, onDelete, showUpdate, setUpdateId, onUpdate }) => {
  const [noteUpdateText, setNoteUpdateText] = useState("")

  useEffect(() => {
    setNoteUpdateText(item.todo)
  }, [])

  const handleChange = (val) => {
    setNoteUpdateText(val)
  }

  const update = () => {
    setUpdateId()
    onUpdate({ ...item, ...{ todo: noteUpdateText } })
  }

  return (
    <View>
      {showUpdate && <View style={styles.listItem}>
        <TextInput value={noteUpdateText} onChangeText={handleChange}
          style={[styles.input, { flexGrow: 1, marginRight: 4 }]}></TextInput>
        <Pressable style={globalStyles.mr4} onPress={() => { update() }}>
          <AntDesign name="save" size={16} color="#000" />
        </Pressable>
        <Pressable onPress={() => { setUpdateId() }}>
          <MaterialCommunityIcons name="cancel" size={16} color="#000" />
        </Pressable>
      </View>
      }
      {!showUpdate && <View style={styles.listItem}>
        <Text style={[{ flexGrow: 1, marginRight: 4 }]}>{item.todo}</Text>
        <Pressable style={globalStyles.mr4} onPress={() => { setUpdateId(item.id) }}>
          <AntDesign name="edit" size={16} color="#000" />
        </Pressable>
        <Pressable onPress={() => { onDelete(item) }}>
          <AntDesign name="close" size={16} color="#000" />
        </Pressable>
      </View>}
    </View>
  )
}

export default TodoListItem

const styles = StyleSheet.create({
  listItem: {
    borderWidth: 2,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#54C7EC",
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    borderColor: '#bbb',
    borderBottomWidth: 2,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff'
  }
})