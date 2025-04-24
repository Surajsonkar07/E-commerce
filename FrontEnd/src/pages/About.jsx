import React from "react";
import { aboutData, assets, team ,newArrivalData} from "../assets/assets";

const About = () => {
  return (
    <>
      <div className="flex mx-5 flex-col md:flex-row items-center justify-around gap-5">
        <div className="w-full md:1/2">
          <h1 className="text-5xl my-2 font-bold text-gray-800">Our Story</h1>
          <p className="text-base font-normal mt-4 text-gray-800">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi odio
            deleniti blanditiis debitis nulla, ipsum ullam reiciendis in quas
            inventore quisquam suscipit totam veritatis praesentium eius
            distinctio quia sint voluptas molestiae voluptatibus maiores rerum.
            Fuga voluptatum accusamus, molestias eius illo at deserunt
            repellendus, et sed, similique nulla tenetur reprehenderit repellat!
            Et harum quidem rerum facilis est et expedita distinctio.
          </p>
          <p className="text-base font-normal mt-4 text-gray-800">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi odio
            deleniti blanditiis debitis nulla, ipsum ullam reiciendis in quas
            inventore quisquam suscipit totam veritatis praesentium eius
            distinctio quia sint voluptas molestiae voluptatibus maiores rerum.
            Fuga voluptatum accusamus, molestias eius illo at deserunt
            repellendus, et sed, similique nulla tenetur reprehenderit repellat!
          </p>
        </div>
        <div className="w-full md:1/2 mb-3">
          <img src={assets.about} alt="" />
        </div>
      </div>
      <div className=" flex flex-wrap items-center justify-center gap-5 mx-5 ">
        {aboutData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 border border-gray-300 rounded-lg p-5 mx-2 mt-8 mb-5"
          >
            <img src={item.image} alt="" className="w-16 h-16 rounded-full" />

            <p className="font-semibold text-2xl">{item.number}</p>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{item.text}</h1>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 my-5 ">
        {team.map((item)=>(
          <div key={item.id} className="flex  flex-col items-center gap-1 border border-gray-300 rounded-xl  mt-4 mb-5 pb-4">
            <img src={item.image} className="w-[80%]" alt="" />
            <h1 className="text-xl font-bold">{item.name}</h1>
            <p className="font-semibold">{item.designation}</p>
          </div>
        ))}
      </div>
         <div className="flex flex-col md:flex-row gap-5 justify-center items-center w-full h-auto p-5">
              {newArrivalData.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 items-center justify-center">
                  <img src={item.image} alt="" />
                  <h4 className="text-xl font-normal text-gray-800">{item.text}</h4>
                  <p className=" text-sm">{item.description}</p>
                </div>
              ))}
            </div>
    </>
  );
};

export default About;
