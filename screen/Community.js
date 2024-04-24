import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const Community = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOpenDocumentPicker = async () => {
    try {
      const documentPickerResult = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Allow selection of any file type
      });
      
      setSelectedFile(documentPickerResult);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picker cancelled');
      } else {
        console.error('Error picking document:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Community Screen</Text>
      <Button title="Open Document Picker" onPress={handleOpenDocumentPicker} />
      {selectedFile && (
        <Text style={styles.fileInfo}>
          Selected File: {selectedFile.name} ({selectedFile.type})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D1117',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  fileInfo: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default Community;
