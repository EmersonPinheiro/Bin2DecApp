import React, {useCallback, useState, useEffect} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  Alert,
} from 'react-native';

const DIGITS_LIMIT = 8;

interface IInsertPressabeProps {
  title: string;
  onPress: () => void;
}

const InsertPressable: React.FC<IInsertPressabeProps> = ({title, onPress}) => {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{borderless: false, radius: 120}}
      style={styles.pressable}
    >
      <View style={{flex: 1}}>
        <Text style={styles.pressableTitle}>{title}</Text>
      </View>
    </Pressable>
  );
};

const App = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [resultValue, setResultValue] = useState<string>('');
  const [digitsLimitEnabled, setDigitsLimitEnabled] = useState<boolean>(true);
  const [
    showPressablesContainer,
    setShowPressablesContainer,
  ] = useState<boolean>(true);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setShowPressablesContainer(false);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setShowPressablesContainer(true);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const onInputChangeText = useCallback(
    (text: string) => {
      if (digitsLimitEnabled && inputValue.length <= DIGITS_LIMIT) {
        const isValid = !!text.match(/(0|1)/gm);

        if (isValid || !text.length) {
          setInputValue(text);
        } else {
          Alert.alert('Please, enter 0 or 1 digit');
        }
      }
    },
    [digitsLimitEnabled, inputValue]
  );

  const onPressInsert = useCallback(
    (value: string) => {
      if (inputValue.length <= 8) {
        setInputValue((iv) => iv + value);
      }
    },
    [inputValue]
  );

  const convert = useCallback(() => {
    let result: number = 0;

    let pow = 0;
    for (let i = inputValue.length - 1; i >= 0; i--) {
      result += +inputValue[i] * 2 ** pow;
      pow++;
    }

    setResultValue(result.toString());
  }, [inputValue]);

  return (
    <View style={{flex: 1}}>
      <View style={styles.resultBoardContainer}>
        <View
          style={{
            flex: 1,
            paddingBottom: 24,
          }}
        >
          <Text style={{flex: 1}}>INPUT</Text>
          <TextInput
            style={{
              height: 64,
              fontSize: 34,
              fontWeight: 'bold',
              borderColor: '#E9C46A',
              borderRadius: 10,
              borderWidth: 2,
            }}
            keyboardType="numeric"
            onChangeText={onInputChangeText}
            value={inputValue}
            maxLength={digitsLimitEnabled ? DIGITS_LIMIT : undefined}
          />
        </View>
        <View style={{flex: 1}}>
          <Text style={{flex: 1}}>RESULT</Text>
          <Text
            style={{
              height: 64,
              fontSize: 34,
              fontWeight: 'bold',
              borderColor: '#E9C46A',
              borderRadius: 10,
              borderWidth: 2,
              textAlignVertical: 'center',
              paddingLeft: 5,
            }}
          >
            {resultValue}
          </Text>
        </View>
      </View>
      {showPressablesContainer && (
        <View style={styles.pressablesContainer}>
          <View style={styles.insertPressablesContainer}>
            <InsertPressable
              title="0"
              onPress={() => onPressInsert('0')}
            ></InsertPressable>
            <InsertPressable
              title="1"
              onPress={() => onPressInsert('1')}
            ></InsertPressable>
          </View>
          <View style={styles.convertPressableContainer}>
            <Pressable
              style={styles.convertPressable}
              android_ripple={{borderless: false, radius: 350}}
              onPress={convert}
            >
              <Text style={styles.pressableTitle}>CONVERT!</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  resultBoardContainer: {
    flex: 1,
    backgroundColor: '#f5e1a2',
    padding: 24,
  },
  insertPressablesContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
  },
  pressable: {
    width: '45%',
    height: '100%',
    elevation: 4,
    backgroundColor: '#264653',
    borderRadius: 10,
  },
  pressablesContainer: {
    flex: 1,
    elevation: 4,
    backgroundColor: '#e0cf96',
  },
  pressableTitle: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  convertPressable: {
    height: '80%',
    width: '100%',
    backgroundColor: '#2A9D8F',
    borderRadius: 10,
    elevation: 4,
  },
  convertPressableContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
});

export default App;
