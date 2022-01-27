import { useEffect, useState } from "react";

const UserInfo = () => {
  const listQuotes = [
    {
      title: "If you can dream it, you can achieve it",
      author: "Zig Ziglar",
    },
    {
      title:
        "Your most unhappy customers are your greatest source of learning.",
      author: "Bill Gates",
    },
    {
      title: "A goal is a dream with a deadline",
      author: "Napoleon Hill",
    },
    {
      title: "If your ship doesn’t come in, swim out to meet it!",
      author: "Jonathan Winters",
    },
    {
      title:
        "Life is not always a matter of holding good cards, but sometimes playing a poor hand well.",
      author: "Jack London",
    },
  ];
  const [currentQuotes, setCurrentQuotes] = useState("No Pain No Gain");
  useEffect(() => {
    const runQuotes = setInterval(randomQuotes, 5000);
    return () => {
      clearInterval(runQuotes);
    };
  }, []);

  const randomQuotes = () => {
    if (listQuotes && listQuotes.length > 0) {
      let newIndex = Math.floor(Math.random() * listQuotes.length);
      setCurrentQuotes(
        `${listQuotes[newIndex].title} - ${listQuotes[newIndex].author}`
      );
    } else {
      return;
    }
  };

  return (
    <>
      <div className="user-info mg-bt-20px">
        <div className="user-avt">
          <img src="https://lethinh2003.xyz/upload/avatar_4965.png" alt="" />
        </div>
        <div className="user-name">Van Thinh Le</div>
        <div className="quotes">
          <span className="quotes-text">{currentQuotes}</span>
        </div>
      </div>
    </>
  );
};
export default UserInfo;
