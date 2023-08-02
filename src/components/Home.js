import React, { useEffect, useState } from 'react';
import { NavBar } from '../components/NavBar';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import the initialized Firestore instance
import turi from '../img/turi.jpg';

export function Home() {
  const navigate = useNavigate();
  const [homeDataList, setHomeDataList] = useState([]);

  const navigateProducts = () => {
    navigate('/products');
  };

  useEffect(() => {
    // Fetch all documents from the "home" collection
    const fetchHomeData = async () => {
      try {
        const homeCollectionRef = collection(db, 'home');
        const homeSnapshot = await getDocs(homeCollectionRef);

        const data = homeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setHomeDataList(data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <>
      <div className="bg-gray-200 w-full min-h-screen flex flex-col justify-center items-center px-4">
        {homeDataList.map((homeData) => (
          <div key={homeData.id} className="w-full sm:w-[700px] p-2 bg-white rounded-xl mb-4">
            <img className="w-full h-[550px] object-cover rounded-xl" src={homeData.imagen} alt="no bale" />
  
            <h2 className="font-bold text-lg">{homeData.title}</h2>
            <p className="text-sm text-gray-600 font-serif">{homeData.comentario}</p>
  
            <Button
              onClick={navigateProducts}
              className="m-2 text-white bg-blue-500 px-3 py-1 rounded-md"
            >
              Realizar Compra
            </Button>
          </div>
        ))}
      </div>
  
      <NavBar />
    </>
  );
  
  
}
