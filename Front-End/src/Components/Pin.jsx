import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { client, urlFor } from "../client";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { AiTwotoneDelete } from "react-icons/ai";
import { MdDownloadForOffline } from "react-icons/md";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { fetchUser } from "../utils/fetchUser";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false);

  const navigate = useNavigate();

  const user = fetchUser();

  const alreadySaved = !!save?.filter(
    (item) => item?.postedBy?._id === user?.googleId
  )?.length;

  const savePin = (id) => {
    if(!alreadySaved){

      client
      .patch(id)
      .setIfMissing({save: []})
      .insert('after','save[-1]' ,[{
        _key: uuidv4(),
        userId: user.googleId,
        postedBy: {
          _type: 'postedBy',
          _ref: user.googleId
        }
      }])
      .commit()
      .then(()=>{
          window.location.reload();
      })
    }
  }

  const deletePin = (id) => {
    client
    .delete(id)
    .then(()=>{
      window.location.reload();
    })
  }

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        {image && (
          <img
            src={urlFor(image).width(250)}
            alt="user-post"
            className="rounded-lg w-full"
          />
        )}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 ml-1 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>

              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {save?.length}  Saved
                </button>
              ) : (
                <button
                onClick={(e)=> {
                  e.stopPropagation();
                  savePin(_id)
                }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
                {destination && (
                  <a href={destination}
                  target='_blank'
                  rel="noReferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-1 pl-2 pr-2 rounded-full opacity-60 hover:opacity-100 hover:shadow-md"
                  >
                    <BsFillArrowUpRightCircleFill />
                    {destination.slice(0, 15)}....
                  </a>
                )}
                {postedBy?._id === user?.googleId && (
                  <button 
                  type="button"
                  className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-base rounded-3xl hover:shadow-md outline-none"
                   onClick={(e)=> {
                    e.stopPropagation();
                    deletePin(_id)
                  }}
                  >
                    <AiTwotoneDelete />
                  </button>
                ) }
            </div>
          </div>
        )}
      </div>
        <Link to={`user-profile/${postedBy?._id}`}
        className='flex gap-2 mt-2 items-center'
        >
          <img
            src={postedBy?.image}
            className="w-8 h-8 rounded-full object-cover" 
            />
            <p className="font-dimibold calitalize">
              {postedBy?.userName}
            </p>
        </Link>
    </div>
  );
};

export default Pin;
