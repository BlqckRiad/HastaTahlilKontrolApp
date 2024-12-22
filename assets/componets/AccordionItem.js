import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';
import Entypo from '@expo/vector-icons/Entypo';

const AccordionItem = ({ title, content }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleExpanded = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity onPress={toggleExpanded} style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        <Animatable.View
          style={{
            transform: [{ rotate: isCollapsed ? '0deg' : '180deg' }],
          }}
          transition="transform"
        >
          <Entypo name="chevron-down" size={24} color="black" />
        </Animatable.View>
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed} align="center">
        <View style={styles.content}>
          {content}
        </View>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    paddingVertical: 10,
  },
});

export default AccordionItem;
