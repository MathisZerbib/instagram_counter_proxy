"use client";

import { useEffect, useState } from "react";
import FlipNumbers from "react-flip-numbers";

export default function Home() {
  const [followers, setFollowers] = useState(null);
  useEffect(() => {
    // Fetch followers count from our API each 2 seconds
    setInterval(() => {
      fetch("http://127.0.0.1:3000/api/followers")
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          setFollowers(data.followers);
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    }, 2000);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        {followers !== null || followers == 0 ? (
          <>
            <p className="text-4xl font-bold text-center">Followers</p>
            <FlipNumbers
              height={55}
              width={40}
              play
              duration={5}
              numberStyle={{
                fontSize: 42,
                fontWeight: "bold",
              }}
              numbers={followers.toString()}
            />
          </>
        ) : (
          <p className="text-4xl font-bold text-center">
            Loading followers count...
          </p>
        )}
      </div>
    </main>
  );
}
