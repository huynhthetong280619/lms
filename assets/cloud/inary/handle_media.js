const handleImageUpload = async () => {
    const { files } = document.querySelector('input[type="file"]')
    const formData = new FormData();
    formData.append('file', files[0]);
    // replace this with your upload preset name
    formData.append('upload_preset', 'gmttm4bo');
    const options = {
        method: 'POST',
        body: formData,
        header: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Accept',
            mode: 'no-cors'
        }
    };

    // replace cloudname with your Cloudinary cloud_name
    return await fetch('https://api.Cloudinary.com/v1_1/dkepvw2rz/upload', options)
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.log(err));
}

export { handleImageUpload }