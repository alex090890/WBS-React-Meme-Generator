import { useState, useEffect } from "react";
import domtoimage from 'dom-to-image';

const MemeComponent = () => {
  const [memes, setMemes] = useState([]);
  const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch("https://api.imgflip.com/get_memes");
        const data = await response.json();
        setMemes(data.data.memes);
        setTopText("");
        setBottomText("");
      } catch (error) {
        console.error("Error fetching memes:", error);
      }
    };

    fetchMemes();
  }, []);

  const handleTopTextChange = (e) => {
    setTopText(e.target.value);
  };

  const handleBottomTextChange = (e) => {
    setBottomText(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadedImage(file);
  };

  const handleDeleteImage = () => {
    setUploadedImage(null);
    setTopText("");
    setBottomText("");
  };

  const handleExportMeme = () => {
    const node = document.getElementById("meme-container");
    domtoimage.toPng(node)
      .then(function (dataUrl) {
        let link = document.createElement('a');
        link.download = 'meme.png';
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error('Error exporting meme:', error);
      });
  };

  const handleUpdateMeme = () => {
    setCurrentMemeIndex((prevIndex) => (prevIndex + 1) % memes.length);
    setTopText("");
    setBottomText("");
  };

  const handlePreviousMeme = () => {
    setCurrentMemeIndex((prevIndex) =>
      prevIndex === 0 ? memes.length - 1 : prevIndex - 1
    );
    setTopText("");
    setBottomText("");
  };
    
    const handleResetWebsite = () => {
    setUploadedImage(null);
    setCurrentMemeIndex(0);
    setTopText("");
    setBottomText("");
  };

  return (
    <div>
      {uploadedImage ? (
        <div>
            <div id="meme-container">
                <img className="uploaded-image" src={URL.createObjectURL(uploadedImage)} alt="Uploaded Meme" />
                <h1 className="toptext">{topText}</h1>
                <h1 className="bottomtext">{bottomText}</h1>
            </div>
            <div>
                <button onClick={handleDeleteImage}>Delete Image</button>
            </div>
        </div>
      ) : (
        <div>
          {memes.length > 0 && (
            <div id="meme-container" style={{ position: "relative", display: "inline-block" }}>
              <img src={memes[currentMemeIndex].url} alt={memes[currentMemeIndex].name} />
              <h1 className="toptext">{topText}</h1>
              <h1 className="bottomtext">{bottomText}</h1>
            </div>
          )}
        </div>
      )}
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: "10px" }} />
        <br />
        <input type="text" placeholder="Enter top text" value={topText} onChange={handleTopTextChange} />
        <br />
        <input type="text" placeholder="Enter bottom text" value={bottomText} onChange={handleBottomTextChange} />
        <br />
        <button onClick={handleUpdateMeme}>Next Meme</button>
        <button onClick={handlePreviousMeme}>Previous Meme</button>
        <button onClick={handleExportMeme}>Export Meme</button>
        
        <button onClick={handleResetWebsite}>Reset Website</button>
      </div>
    </div>
  );
};

export default MemeComponent;