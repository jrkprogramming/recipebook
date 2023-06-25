/* eslint-disable react/no-unescaped-entities */
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api, type RouterOutputs } from "~/utils/api";
import { Header } from "../components/Header";
import { useState, type FormEvent, type ChangeEvent } from "react";
import style from "./index.module.css";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Recipe Book</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/path/to/styles.css" />
      </Head>
      <div className={style.videoContainer}>
        <video autoPlay loop muted playsInline className={style.video}>
          <source src="/pot_-_267(720p).mp4" type="video/mp4" />
        </video>
        <div className={style.main}>
          <h2>Let's Cook Something Together </h2>
          <h1>Recipe Keeper by JRK</h1>
          <p>
            Welcome to Recipe Keeper, the ultimate platform for food
            enthusiasts! Keep track of your favorite recipes and embark on a
            culinary journey like no other. Discover mouthwatering recipes,
            capture your cooking adventures, and create a personal log of
            culinary triumphs. Share your kitchen creations with friends and
            family, inspiring them to explore new flavors and techniques.
            Whether you're a seasoned chef or an aspiring home cook, Recipe
            Keeper is your go-to companion for organizing, sharing, and
            celebrating the art of cooking. Let's savor the joy of food together
            and unlock a world of delicious possibilities. Bon appétit!
          </p>
          <div className={style.buttons}>
            {!sessionData?.user && (
              <button className={style.btn1} onClick={() => void signIn()}>
                LOGIN
              </button>
            )}
            {sessionData?.user && (
              <Link className={style.btn1} href={"/myRecipes"}>
                GO TO YOUR RECIPES
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
