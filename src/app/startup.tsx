import './ps2.scss';

const Startup = () => {
    console.log('running startup');
    return (
    <div className="startup-container">
      <div className="screen">
      <div className="content">
          <p className="copyright">Mony computer entertainment</p>
          <p className="branding font-playstation">Miladystation 2</p>
      </div>
      <div className="inner">
          <div className="inner-bg"></div>
          <div className="particles">
              <span></span>
              <span></span>
              <span></span>
          </div>
          {Boxes(112)} 
      </div>
  </div>
  </div>
    )
  }
  
  const Boxes = (count:number) => {
    // Function to generate an array of numbers from 0 to count - 1
    const range = (start:number, end:number) => Array.from({ length: end - start }, (_, i) => start + i);
  
    return (
        <>
            {/* Generate .box-container elements */}
            {range(0, count).map((index) => (
                <div key={index} className="box-container">
                    {/* .box element inside .box-container */}
                    <div className="box">
                        <div className="top"></div>
                        <div className="bottom"></div>
                        <div className="left"></div>
                        <div className="right"></div>
                    </div>
                </div>
            ))}
        </>
    );
  };

export default Startup