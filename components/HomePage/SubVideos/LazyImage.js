import React, { Component } from 'react';

export default class LazyImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imgUrl: `../../../static/image/video-cover-${props.width}x${props.height}.png`
        };
    }

  onImageLoad = () => {
      this.setState({
          imgUrl: this.props.src
      });
  }

  componentDidMount() {
      this.image = new Image();
      this.image.src = this.props.src;
      this.image.addEventListener('load', this.onImageLoad);
  }

  componentWillUnmount() {
      this.image.removeEventListener('load', this.onImageLoad);
  }

  componentWillReceiveProps(newProps) {
      if (this.props.src !== newProps.src) {
          this.setState({
              imgUrl: newProps.src
          });
      }
  }

  render() {
      const { imgUrl } = this.state;
      const imgProps = {
          ...this.props,
          src: imgUrl
      };
      return (
          <img {...imgProps} />
      );
  }
}
