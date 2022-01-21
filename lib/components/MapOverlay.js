import {
  ViewPropTypes,
} from 'deprecated-react-native-prop-types';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';

import decorateMapComponent, {
  SUPPORTED,
  USES_DEFAULT_IMPLEMENTATION,
} from './decorateMapComponent';

const viewConfig = {
  uiViewClassName: 'AIR<provider>MapOverlay',
  validAttributes: {
    image: true,
  },
};

// if ViewPropTypes is not defined fall back to View.propType (to support RN < 0.44)
const viewPropTypes = ViewPropTypes || View.propTypes;

const propTypes = {
  ...viewPropTypes,
  // A custom image to be used as overlay.
  image: PropTypes.any.isRequired,
  // Top left and bottom right coordinates for the overlay
  bounds: PropTypes.arrayOf(PropTypes.array.isRequired).isRequired,
  // Rotation to apply to the overlay, in degrees
  bearing: PropTypes.number,
  // Callback that is called once image is loaded.
  onLoad: PropTypes.func,
};

class MapOverlay extends Component {

  render() {
    let image;
    if (this.props.image) {
      if (typeof this.props.image.startsWith === 'function'
        && this.props.image.startsWith('http')) {
        image = this.props.image;
      } else {
        image = Image.resolveAssetSource(this.props.image) || {};
        image = image.uri;
      }
    }

    const AIRMapOverlay = this.getAirComponent();

    return (
      <AIRMapOverlay
        {...this.props}
        image={image}
        style={[styles.overlay, this.props.style]}
        bearing={this.props.bearing}
        onLoad={this.props.onLoad}
      />
    );
  }
}

MapOverlay.propTypes = propTypes;
MapOverlay.viewConfig = viewConfig;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});

MapOverlay.Animated = Animated.createAnimatedComponent(MapOverlay);

export default decorateMapComponent(MapOverlay, {
  componentType: 'Overlay',
  providers: {
    google: {
      ios: SUPPORTED,
      android: USES_DEFAULT_IMPLEMENTATION,
    },
  },
});
