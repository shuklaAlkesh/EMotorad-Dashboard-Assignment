const ImageGallery = () => {
  // Sample image data - replace with your actual images
  const images = [
    {
      id: 1,
      url: 'https://via.placeholder.com/300',
      title: 'Image 1',
      description: 'Description for image 1'
    },
    {
      id: 2,
      url: 'https://via.placeholder.com/300',
      title: 'Image 2',
      description: 'Description for image 2'
    },
    {
      id: 3,
      url: 'https://via.placeholder.com/300',
      title: 'Image 3',
      description: 'Description for image 3'
    },
    {
      id: 4,
      url: 'https://via.placeholder.com/300',
      title: 'Image 4',
      description: 'Description for image 4'
    }
  ];

  return (
    <section className="gallery-section">
      <div className="gallery-header">
        <h2>Image Gallery</h2>
        <button className="upload-btn">Upload New Image</button>
      </div>
      <div className="image-gallery">
        {images.map(image => (
          <div key={image.id} className="image-card">
            <img src={image.url} alt={image.title} />
            <div className="image-info">
              <h3>{image.title}</h3>
              <p>{image.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageGallery; 