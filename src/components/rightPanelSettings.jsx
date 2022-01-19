import React from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Toggle from 'material-ui/Toggle';
import store from '../store/store.js';
import { Actions } from '../store/actions.js';
import config from '../store/config.js';



const RightPanelSettings = () => {
  const styles = {
    radioButton: { marginBottom: 16 },
    toggle: { marginBottom: 16 }
  };

  let localSettings = store.settings;

  const gloabalAction = (key, value) => {
    localSettings[key] = value;
    Actions.changeSettings(localSettings);
    if (key === 'onlyMetar')
      setTimeout(() => window.location.reload(), 1500);
  };

  return <div className="child-container last">
    <h1>
      <i className="ion-gear-a"/>
      &nbsp;&nbsp;
      <span>Settings</span>
    </h1>
    { config.source === 'all'
      ? <div>
        <h2>
          <i className="ion-plane" />
          &nbsp;
          &nbsp;
          {'For aviation'}
        </h2>
        <div>
          <Toggle
            label="Show universal time"
            onToggle={(event, isInputChecked) => gloabalAction('universalTime', isInputChecked)}
            toggled={localSettings.universalTime}
            style={styles.toggle}
            />
        </div>
        <div>
          <Toggle label="Identifier in the left panel"
            onToggle={(event, isInputChecked) => gloabalAction('idInsteadLoc', isInputChecked)}
            toggled={localSettings.idInsteadLoc}
            style={styles.toggle}
            />
        </div>
        <div>
          <Toggle
            label="Show METAR & TAF"
            onToggle={(event, isInputChecked) => gloabalAction('metarRaw', isInputChecked)}
            toggled={localSettings.metarRaw}
            style={styles.toggle}
            />
        </div>
        <div className="error">
          The next option reloads the app.
        </div>
        <br />
        <div>
          <Toggle
            label="Show only airport"
            onToggle={(event, isInputChecked) => gloabalAction('onlyMetar', isInputChecked)}
            toggled={localSettings.onlyMetar}
            style={styles.toggle}
          />
        </div>
      </div>
      : ''
    }

    <h2>
      <i className="ion-shuffle" />
      &nbsp;
      &nbsp;
      {'Wind unit'}
    </h2>
    <RadioButtonGroup
      name="windUnit"
      defaultSelected={localSettings.windUnit}
      onChange={(event, checked) => gloabalAction('windUnit', checked)}
      >
      <RadioButton value="kts" label="knots" style={styles.radioButton} />
      <RadioButton value="km/h" label="kilometers per hour" style={styles.radioButton} />
      <RadioButton value="m/s" label="meters per second" style={styles.radioButton} />
    </RadioButtonGroup>
    <h2>
      <i className="ion-compass" />
      &nbsp;
      &nbsp;
      {'Heading unit'}
    </h2>
    <RadioButtonGroup
      name="headingUnit"
      defaultSelected={localSettings.headingUnit}
      onChange={(event, checked) => gloabalAction('headingUnit', checked)}
      >
      <RadioButton value="arrow" label="Arrow" style={styles.radioButton} />
      <RadioButton value="abbrev" label="Abbreviation" style={styles.radioButton} />
      <RadioButton value="degrees" label="Degrees" style={styles.radioButton} />
    </RadioButtonGroup>
    <h2>
      <i className="ion-thermometer" />
      &nbsp;
      &nbsp;
      {' Temperature unit'}
    </h2>
    <RadioButtonGroup
      name="tempUnit"
      defaultSelected={localSettings.tempUnit}
      onChange={(event, checked) => gloabalAction('tempUnit', checked)}
      >
      <RadioButton value="C" label="Celsius" style={styles.radioButton} />
      <RadioButton value="F" label="Fahrenheit" style={styles.radioButton} />
    </RadioButtonGroup>
    <h2>
      <i className="ion-waterdrop" />
      &nbsp;
      &nbsp;
      {'Rain unit'}
    </h2>
    <RadioButtonGroup
      name="rainUnit"
      defaultSelected={localSettings.rainUnit}
      onChange={(event, checked) => gloabalAction('rainUnit', checked)}
      >
      <RadioButton value="picto" label="Pictogram" style={styles.radioButton} />
      <RadioButton value="precip" label="Precipitation" style={styles.radioButton} />
    </RadioButtonGroup>
  </div>;
};

export default RightPanelSettings;
