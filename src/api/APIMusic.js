import { useState, useEffect } from "react";
const APIMusic = (type, duration, category) => {
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const Category = [
    {
      title: "Nhật Bản",
      image: "https://i.imgur.com/XGjHmGp.jpg",
      desc: "Nhạc Nhật",
      category: "JP",
    },
    {
      title: "Anh Quốc",
      image: "https://i.imgur.com/gev29pD.jpg",
      desc: "Nhạc Anh",
      category: "UK",
    },
    {
      title: "Việt Nam",
      image: "https://i.imgur.com/AhOdwtH.jpg",
      desc: "Nhạc Việt Nam",
      category: "VN",
    },
  ];
  const PlayList = [
    {
      id: 1,
      name: "Call Of Silence",
      image: "https://i.imgur.com/0HSZKLu.jpg",
      link: "https://www.mboxdrive.com/CallOfSilence.mp3",
      author: "Hiroyuki Sawano; Gemie",
      category: "JP",
    },
    {
      id: 2,
      name: "Nandemonaiya",
      image: "https://i.imgur.com/uJxbqaC.jpg",
      link: "https://www.mboxdrive.com/Nandemonaiya.mp3",
      author: "Kamishiraishi Mone",
      category: "JP",
    },
    {
      id: 3,
      name: "Uchiage Hanabi",
      image: "https://i.imgur.com/98jj7w2.jpg",
      link: "https://www.mboxdrive.com/UchiageHanabi.mp3",
      author: "Kenshi Yonezu",
      category: "JP",
    },
    {
      id: 4,
      name: "Hazakura",
      image: "https://i.imgur.com/3B2eBcK.jpg",
      link: "https://www.mboxdrive.com/Hazakura.mp3",
      author: "Kie Kitano",
      category: "JP",
    },
    {
      id: 5,
      name: "Orange",
      image: "https://i.imgur.com/WdlbOlN.jpg",
      link: "https://www.mboxdrive.com/Orange7.mp3",
      author: "7!!",
      category: "JP",
    },
    {
      id: 6,
      name: "Unstoppable",
      image: "https://i.imgur.com/jo6xmpU.jpg",
      link: "https://www.mboxdrive.com/Unstoppable%20-%20Sia.mp3",
      author: "Sia",
      category: "UK",
    },
    {
      id: 7,
      name: "Touch",
      image: "https://i.imgur.com/IBSDqGj.jpg",
      link: "https://www.mboxdrive.com/Touch%20-%203LAU_%20Carly%20Paige.mp3",
      author: "3LAU, Carly Paige",
      category: "UK",
    },
    {
      id: 8,
      name: "Kawaki Wo Ameku",
      image: "https://i.imgur.com/zwErqbo.jpg",
      link: "https://www.mboxdrive.com/KawakiWoAmeku-Minami.mp3",
      author: "Minami",
      category: "JP",
    },
    {
      id: 9,
      name: "Dakara Boku Wa Ongaku Wo Yameta",
      image: "https://i.imgur.com/46DuxOg.jpg",
      link: "https://www.mboxdrive.com/DakaraBokuWaOngakuWoYameta-Yorushika-6103798.mp3",
      author: "Yorushika",
      category: "JP",
    },
    {
      id: 10,
      name: "Fractures Nightcore",
      image: "https://i.imgur.com/1Gd39L2.jpg",
      link: "https://www.mboxdrive.com/Fractures-NightcoreIlleniumNevve-5690375.mp3",
      author: "Trivecta",
      category: "UK",
    },
  ];
  useEffect(() => {
    function FetchAPI() {
      return new Promise(function (resolve, reject) {
        const test = setTimeout(() => {
          resolve();
          if (type === "getMusicList") {
            setData(PlayList);
          }
          if (type === "getNewMusicList") {
            const newList = PlayList.filter((item) => {
              return item.id > PlayList.length / 2;
            });

            setData(newList);
          }
          if (type === "getMusicCategory") {
            if (category) {
              const newFilterData = PlayList.filter(
                (item) => item.category === category
              );

              setData(newFilterData);
            } else {
              setData(Category);
            }
          }
          if (type === "getMusicCategoryDetail") {
            const newFilterData = Category.filter(
              (item) => item.category === category
            );

            setData(newFilterData);
          }
        }, duration);
      }).then(() => {
        setisLoading(false);
      });
    }
    FetchAPI();
    return () => {
      setData([]);
      setisLoading(true);
    };
  }, []);
  return {
    data,
    isLoading,
  };
};
export default APIMusic;
