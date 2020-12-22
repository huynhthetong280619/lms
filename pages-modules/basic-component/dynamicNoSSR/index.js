import React from 'react';

class OpenWidget extends React.Component {
    openWidget = () => {
        // create the widget
        console.log('type of', typeof window)
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: 'dkepvw2rz',
                uploadPreset: 'gmttm4bo',
            },
            (error, result) => {
                console.log(result)
                if (result.event === 'success') {
                    this.setState({
                        imageUrl: result.info.secure_url,
                        imageAlt: `An image of ${result.info.original_filename}`
                    })
                }
            },
        );
        widget.open(); // open up the widget after creation

    };

    render() {
        return (
            <button onClick={() => this.openWidget()}>Open Widget</button>
        )
    }
}

export default OpenWidget