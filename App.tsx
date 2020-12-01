import React, {useCallback, useState, useEffect} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  Alert,
  ScrollView,
  Switch,
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
      console.log(digitsLimitEnabled);
      if (
        (digitsLimitEnabled && inputValue.length <= DIGITS_LIMIT) ||
        !digitsLimitEnabled
      ) {
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
      if (
        (digitsLimitEnabled && inputValue.length <= DIGITS_LIMIT) ||
        !digitsLimitEnabled
      ) {
        setInputValue((iv) => iv + value);
      }
    },
    [digitsLimitEnabled, inputValue]
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

  const clearInputs = useCallback(() => {
    setInputValue('');
    setResultValue('');
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{flex: 1}}
      keyboardDismissMode="interactive"
    >
      <View style={styles.resultBoardContainer}>
        <View
          style={{
            flex: 1,
            paddingBottom: 24,
          }}
        >
          <Text style={styles.labelTitle}>INPUT</Text>
          <TextInput
            style={styles.resultValueText}
            keyboardType="numeric"
            onChangeText={onInputChangeText}
            value={inputValue}
            maxLength={digitsLimitEnabled ? DIGITS_LIMIT : undefined}
          />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.labelTitle}>RESULT</Text>
          <Text style={styles.resultValueText}>{resultValue}</Text>
        </View>
      </View>
      {showPressablesContainer && (
        <View style={styles.pressablesContainer}>
          <View style={{flex: 0.4, flexDirection: 'row'}}>
            <Text style={{textAlignVertical: 'center'}}>
              Enable 8-digit limit
            </Text>
            <Switch
              value={digitsLimitEnabled}
              onValueChange={() => setDigitsLimitEnabled(!digitsLimitEnabled)}
            />
          </View>
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
            <Pressable
              style={styles.clearPressable}
              android_ripple={{borderless: false, radius: 350}}
              onPress={clearInputs}
            >
              <Text style={[styles.pressableTitle, {fontSize: 22}]}>
                Clear inputs
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
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
    paddingVertical: 24,
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
    padding: 24,
    paddingBottom: 8,
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
    width: '65%',
    backgroundColor: '#2A9D8F',
    borderRadius: 10,
    elevation: 4,
  },
  clearPressable: {
    height: '80%',
    width: '25%',
    backgroundColor: '#E76F51',
    borderRadius: 10,
    elevation: 4,
  },
  convertPressableContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputValueText: {
    height: 64,
    fontSize: 34,
    fontWeight: 'bold',
    borderColor: '#E9C46A',
    borderRadius: 10,
    borderWidth: 2,
  },
  resultValueText: {
    height: 64,
    fontSize: 34,
    fontWeight: 'bold',
    borderColor: '#E9C46A',
    borderRadius: 10,
    borderWidth: 2,
    textAlignVertical: 'center',
    paddingLeft: 5,
  },
  labelTitle: {
    flex: 0.7,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
