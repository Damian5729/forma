"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Product {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingLabel: string;
  category: string;
}

interface Brand {
  name: string;
  emoji: string;
  color: string;
  products: Product[];
}

const BRANDS: Brand[] = [
  {
    name: "More Nutrition",
    emoji: "🟢",
    color: "var(--g-green-dark)",
    products: [
      // Proteinshakes & Pulver
      { name: "Protein Iced Coffee", calories: 115, protein: 20, carbs: 4.2, fat: 1.5, servingLabel: "30g", category: "Shake" },
      { name: "Protein Iced Matcha Latte", calories: 112, protein: 18, carbs: 5.1, fat: 1.5, servingLabel: "30g", category: "Shake" },
      { name: "Protein Iced Chai Latte", calories: 115, protein: 19, carbs: 5.1, fat: 1.8, servingLabel: "30g", category: "Shake" },
      { name: "Protein Milkshake Style", calories: 114, protein: 24, carbs: 1.1, fat: 1.1, servingLabel: "30g", category: "Shake" },
      { name: "Protein Milkyccino", calories: 115, protein: 19, carbs: 3.6, fat: 2.1, servingLabel: "30g", category: "Shake" },
      { name: "Clear Protein (Whey Isolat)", calories: 104, protein: 25, carbs: 1.0, fat: 0, servingLabel: "30g", category: "Isolat" },
      { name: "Vegan Protein", calories: 106, protein: 23, carbs: 2.5, fat: 0.6, servingLabel: "30g", category: "Vegan" },
      { name: "Saucen & Back Protein", calories: 119, protein: 23, carbs: 1.8, fat: 2.1, servingLabel: "30g", category: "Special" },
      { name: "Clear Glow Peptides", calories: 11, protein: 2.5, carbs: 0.1, fat: 0, servingLabel: "10g", category: "Special" },
      // Frühstück & warme Mahlzeiten
      { name: "Protein Porridge", calories: 208, protein: 30, carbs: 15.6, fat: 2.1, servingLabel: "60g", category: "Special" },
      { name: "Protein Milchreis", calories: 155, protein: 22.8, carbs: 13.8, fat: 0.5, servingLabel: "60g", category: "Special" },
      { name: "Protein Grießpudding", calories: 202, protein: 33.6, carbs: 13.8, fat: 0.8, servingLabel: "60g", category: "Special" },
      { name: "Protein Pancake & Waffle Mix", calories: 161, protein: 25, carbs: 12, fat: 1.0, servingLabel: "100g (zubereitet)", category: "Special" },
      // Desserts
      { name: "Protein Pudding", calories: 41, protein: 6.8, carbs: 2.7, fat: 0.2, servingLabel: "40g", category: "Special" },
      { name: "Protein Dessert", calories: 111, protein: 12, carbs: 15.2, fat: 3.6, servingLabel: "40g", category: "Special" },
      // Riegel
      { name: "Protein Bar", calories: 224, protein: 18, carbs: 22.8, fat: 7.2, servingLabel: "60g", category: "Riegel" },
      { name: "Protein Wafer Bar", calories: 240, protein: 10, carbs: 25, fat: 11.5, servingLabel: "50g", category: "Riegel" },
      { name: "Vegan Protein Bar", calories: 229, protein: 10.8, carbs: 26.4, fat: 8.4, servingLabel: "60g", category: "Riegel" },
      // Snacks
      { name: "Protein Satisbites", calories: 55, protein: 4.5, carbs: 6.0, fat: 2.1, servingLabel: "30g", category: "Snacks" },
      { name: "Protein Peanut Flips", calories: 101, protein: 8.8, carbs: 7.0, fat: 3.8, servingLabel: "30g", category: "Snacks" },
      { name: "Protein Wrap", calories: 197, protein: 11, carbs: 24, fat: 5.4, servingLabel: "1 Wrap", category: "Snacks" },
      { name: "Chunky Popcorn", calories: 119, protein: 2.6, carbs: 14.4, fat: 4.5, servingLabel: "30g", category: "Snacks" },
      // Greens
      { name: "daily100 (Greens)", calories: 105, protein: 1.3, carbs: 14, fat: 0.6, servingLabel: "40g", category: "Special" },
      // Saucen & Dips
      { name: "Protein Saucen Fix", calories: 39, protein: 6.3, carbs: 2.4, fat: 0.4, servingLabel: "30g", category: "Extras" },
      { name: "Light Gourmet Sauce", calories: 4, protein: 0, carbs: 0.2, fat: 0.2, servingLabel: "30g", category: "Extras" },
      { name: "Light Salsa Dip", calories: 11, protein: 0.3, carbs: 3.6, fat: 0, servingLabel: "30g", category: "Extras" },
      { name: "Light Chocolate Drops", calories: 74, protein: 0.7, carbs: 8.7, fat: 4.2, servingLabel: "15g", category: "Extras" },
      // Süßungsmittel & Flavors
      { name: "Chunky Flavour", calories: 0, protein: 0, carbs: 0.1, fat: 0, servingLabel: "5g", category: "Extras" },
      { name: "Stevia Chunky Flavour", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "5g", category: "Extras" },
      { name: "No More Sugar", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "5g", category: "Extras" },
      { name: "Moremelade", calories: 1, protein: 0, carbs: 0.8, fat: 0, servingLabel: "15g", category: "Extras" },
      { name: "Nut Butter", calories: 180, protein: 3.3, carbs: 9.0, fat: 15, servingLabel: "30g", category: "Extras" },
      // Sirupe & Getränke
      { name: "Zerup (Getränkesirup)", calories: 1, protein: 0, carbs: 0, fat: 0, servingLabel: "30ml", category: "Extras" },
      { name: "Zerup Barista", calories: 1, protein: 0, carbs: 0.2, fat: 0, servingLabel: "30ml", category: "Extras" },
      { name: "More FIZI", calories: 113, protein: 0, carbs: 17.5, fat: 0, servingLabel: "250ml", category: "Extras" },
      { name: "2 KCALS Ölspray", calories: 2, protein: 0, carbs: 0, fat: 0.2, servingLabel: "1 Sprüh", category: "Extras" },
      // Supplements
      { name: "MORE Collagen+", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Portion", category: "Extras" },
      { name: "Creatine+ Gummies", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Tagesportion", category: "Extras" },
      { name: "Every Workout 4.0 (Pre-Workout)", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Portion", category: "Extras" },
    ],
  },
  {
    name: "Foodspring",
    emoji: "🔵",
    color: "rgba(56,120,220,0.1)",
    products: [
      // Whey
      { name: "Whey Protein – Schokolade", calories: 120, protein: 23, carbs: 4.0, fat: 2.0, servingLabel: "30g", category: "Whey" },
      { name: "Whey Protein – Vanilla", calories: 118, protein: 23, carbs: 3.5, fat: 2.0, servingLabel: "30g", category: "Whey" },
      { name: "Whey Protein – Strawberry", calories: 119, protein: 23, carbs: 3.8, fat: 2.0, servingLabel: "30g", category: "Whey" },
      { name: "Whey Protein – Banana", calories: 119, protein: 23, carbs: 3.8, fat: 2.0, servingLabel: "30g", category: "Whey" },
      { name: "Whey Protein – Cookies & Cream", calories: 122, protein: 22, carbs: 4.5, fat: 2.2, servingLabel: "30g", category: "Whey" },
      { name: "Whey Protein – Salted Caramel", calories: 120, protein: 23, carbs: 4.0, fat: 2.0, servingLabel: "30g", category: "Whey" },
      // Whey Zero
      { name: "Whey Zero – Schokolade", calories: 108, protein: 24, carbs: 1.5, fat: 1.0, servingLabel: "30g", category: "Whey" },
      { name: "Whey Zero – Vanilla", calories: 106, protein: 24, carbs: 1.2, fat: 1.0, servingLabel: "30g", category: "Whey" },
      // Clear Whey
      { name: "Clear Whey – Lemon", calories: 90, protein: 20, carbs: 1.5, fat: 0, servingLabel: "25g", category: "Clear Whey" },
      { name: "Clear Whey – Peach", calories: 88, protein: 20, carbs: 1.2, fat: 0, servingLabel: "25g", category: "Clear Whey" },
      { name: "Clear Whey – Watermelon", calories: 89, protein: 20, carbs: 1.3, fat: 0, servingLabel: "25g", category: "Clear Whey" },
      { name: "Clear Whey – Cherry", calories: 88, protein: 20, carbs: 1.2, fat: 0, servingLabel: "25g", category: "Clear Whey" },
      // Vegan
      { name: "Vegan Protein – Schokolade", calories: 122, protein: 22, carbs: 4.5, fat: 2.5, servingLabel: "35g", category: "Vegan" },
      { name: "Vegan Protein – Vanilla", calories: 120, protein: 22, carbs: 4.0, fat: 2.5, servingLabel: "35g", category: "Vegan" },
      { name: "Vegan Protein – Strawberry", calories: 120, protein: 22, carbs: 4.2, fat: 2.3, servingLabel: "35g", category: "Vegan" },
      // Shape Shake
      { name: "Shape Shake 2.0 – Schokolade", calories: 206, protein: 26, carbs: 12, fat: 5.0, servingLabel: "50g", category: "Shake" },
      { name: "Shape Shake 2.0 – Vanilla", calories: 202, protein: 26, carbs: 11, fat: 5.0, servingLabel: "50g", category: "Shake" },
      { name: "Shape Shake 2.0 – Strawberry", calories: 200, protein: 26, carbs: 11, fat: 4.5, servingLabel: "50g", category: "Shake" },
      // Riegel
      { name: "Extra Chocolate Bar – Chocolate", calories: 193, protein: 21, carbs: 16, fat: 5.0, servingLabel: "65g", category: "Riegel" },
      { name: "Extra Chocolate Bar – White Choco Almond", calories: 200, protein: 20, carbs: 17, fat: 6.0, servingLabel: "65g", category: "Riegel" },
      { name: "Protein Bar – Hazelnut", calories: 200, protein: 20, carbs: 17, fat: 6.0, servingLabel: "65g", category: "Riegel" },
      { name: "Protein Bar – Strawberry", calories: 197, protein: 20, carbs: 16, fat: 5.5, servingLabel: "65g", category: "Riegel" },
      { name: "Protein Cookie – Choco Chip", calories: 210, protein: 15, carbs: 22, fat: 7.0, servingLabel: "60g", category: "Riegel" },
      // Extras
      { name: "Pre-Workout Booster", calories: 25, protein: 0, carbs: 6.0, fat: 0, servingLabel: "10g", category: "Extras" },
      { name: "Creatine", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "5g", category: "Extras" },
      { name: "BCAA", calories: 10, protein: 3.0, carbs: 0, fat: 0, servingLabel: "8g", category: "Extras" },
      { name: "EAA", calories: 12, protein: 4.0, carbs: 0, fat: 0, servingLabel: "8g", category: "Extras" },
      { name: "L-Carnitin", calories: 5, protein: 0, carbs: 1.0, fat: 0, servingLabel: "10ml", category: "Extras" },
      { name: "Omega-3", calories: 10, protein: 0, carbs: 0, fat: 1.0, servingLabel: "1 Kapsel", category: "Extras" },
      { name: "Protein Pancakes", calories: 170, protein: 18, carbs: 18, fat: 3.0, servingLabel: "55g", category: "Special" },
    ],
  },
  {
    name: "Myprotein",
    emoji: "🟠",
    color: "rgba(255,120,30,0.1)",
    products: [
      // Impact Whey
      { name: "Impact Whey – Chocolate", calories: 103, protein: 21, carbs: 3.0, fat: 1.9, servingLabel: "25g", category: "Whey" },
      { name: "Impact Whey – Vanilla", calories: 100, protein: 21, carbs: 2.5, fat: 1.7, servingLabel: "25g", category: "Whey" },
      { name: "Impact Whey – Strawberry Cream", calories: 101, protein: 21, carbs: 2.8, fat: 1.8, servingLabel: "25g", category: "Whey" },
      { name: "Impact Whey – Salted Caramel", calories: 103, protein: 21, carbs: 3.0, fat: 1.9, servingLabel: "25g", category: "Whey" },
      { name: "Impact Whey – Banana", calories: 101, protein: 21, carbs: 2.8, fat: 1.8, servingLabel: "25g", category: "Whey" },
      { name: "Impact Whey – Cookies & Cream", calories: 105, protein: 21, carbs: 3.5, fat: 2.0, servingLabel: "25g", category: "Whey" },
      { name: "Impact Whey – Rocky Road", calories: 104, protein: 21, carbs: 3.2, fat: 2.0, servingLabel: "25g", category: "Whey" },
      { name: "Impact Whey – Unflavoured", calories: 95, protein: 21, carbs: 1.0, fat: 1.5, servingLabel: "25g", category: "Whey" },
      // Impact Isolate
      { name: "Impact Whey Isolate – Chocolate", calories: 93, protein: 23, carbs: 1.5, fat: 0.5, servingLabel: "25g", category: "Isolat" },
      { name: "Impact Whey Isolate – Vanilla", calories: 91, protein: 23, carbs: 1.2, fat: 0.5, servingLabel: "25g", category: "Isolat" },
      { name: "Impact Whey Isolate – Strawberry", calories: 92, protein: 23, carbs: 1.3, fat: 0.5, servingLabel: "25g", category: "Isolat" },
      // Clear Whey
      { name: "Clear Whey Isolate – Lemon", calories: 90, protein: 20, carbs: 1.0, fat: 0, servingLabel: "25g", category: "Clear" },
      { name: "Clear Whey Isolate – Watermelon", calories: 88, protein: 20, carbs: 0.8, fat: 0, servingLabel: "25g", category: "Clear" },
      { name: "Clear Whey Isolate – Peach Mango", calories: 89, protein: 20, carbs: 0.9, fat: 0, servingLabel: "25g", category: "Clear" },
      { name: "Clear Whey Isolate – Cherry", calories: 88, protein: 20, carbs: 0.8, fat: 0, servingLabel: "25g", category: "Clear" },
      { name: "Clear Whey Isolate – Blue Raspberry", calories: 88, protein: 20, carbs: 0.8, fat: 0, servingLabel: "25g", category: "Clear" },
      // THE Whey
      { name: "THE Whey – Chocolate Caramel", calories: 130, protein: 25, carbs: 4.0, fat: 2.5, servingLabel: "35g", category: "Premium" },
      { name: "THE Whey – Vanilla Milkshake", calories: 128, protein: 25, carbs: 3.5, fat: 2.5, servingLabel: "35g", category: "Premium" },
      // Vegan
      { name: "Vegan Protein Blend – Chocolate", calories: 115, protein: 22, carbs: 4.5, fat: 2.0, servingLabel: "30g", category: "Vegan" },
      { name: "Vegan Protein Blend – Vanilla", calories: 113, protein: 22, carbs: 4.0, fat: 2.0, servingLabel: "30g", category: "Vegan" },
      { name: "Vegan Protein Blend – Strawberry", calories: 113, protein: 22, carbs: 4.2, fat: 1.8, servingLabel: "30g", category: "Vegan" },
      // Snacks
      { name: "Protein Brownie – Chocolate", calories: 186, protein: 20, carbs: 17, fat: 5.0, servingLabel: "75g", category: "Riegel" },
      { name: "Protein Brownie – Salted Caramel", calories: 188, protein: 20, carbs: 17, fat: 5.2, servingLabel: "75g", category: "Riegel" },
      { name: "Protein Flapjack – Chocolate", calories: 220, protein: 18, carbs: 24, fat: 6.0, servingLabel: "80g", category: "Riegel" },
      { name: "Crispy Protein Bar – Chocolate", calories: 185, protein: 20, carbs: 16, fat: 5.0, servingLabel: "65g", category: "Riegel" },
      { name: "Protein Cookie – Chocolate Chip", calories: 215, protein: 16, carbs: 22, fat: 7.0, servingLabel: "75g", category: "Riegel" },
      // Extras
      { name: "Creatine Monohydrat", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "5g", category: "Extras" },
      { name: "BCAA 2:1:1", calories: 18, protein: 4.0, carbs: 0.5, fat: 0, servingLabel: "10g", category: "Extras" },
      { name: "L-Glutamin", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "5g", category: "Extras" },
      { name: "Beta-Alanine", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "2g", category: "Extras" },
      { name: "THE Pre-Workout", calories: 30, protein: 0, carbs: 7.0, fat: 0, servingLabel: "12g", category: "Extras" },
      { name: "Omega-3", calories: 9, protein: 0, carbs: 0, fat: 1.0, servingLabel: "1 Kapsel", category: "Extras" },
      { name: "ZMA", calories: 5, protein: 0, carbs: 0, fat: 0, servingLabel: "3 Kapseln", category: "Extras" },
    ],
  },
  {
    name: "ESN",
    emoji: "🟡",
    color: "rgba(200,200,20,0.1)",
    products: [
      // Proteinpulver — Whey (pro 30g Serving, berechnet aus /100g)
      { name: "Designer Whey Protein", calories: 113, protein: 22.5, carbs: 1.8, fat: 1.4, servingLabel: "30g", category: "Whey" },
      { name: "Performance Whey Hydrolysate + Isolate", calories: 109, protein: 24, carbs: 1.8, fat: 0.3, servingLabel: "30g", category: "Whey" },
      { name: "Basic Whey", calories: 130, protein: 22, carbs: 2.3, fat: 2.3, servingLabel: "30g", category: "Whey" },
      // Isolat
      { name: "Iso Whey Protein Isolat", calories: 111, protein: 25, carbs: 1.4, fat: 0.5, servingLabel: "30g", category: "Isolat" },
      // Clear / Fruity (mit Wasser mischen)
      { name: "Isoclear Whey Protein Isolate", calories: 104, protein: 25, carbs: 0.2, fat: 0, servingLabel: "30g", category: "Clear" },
      { name: "Fruity Whey Isolate", calories: 106, protein: 27, carbs: 0.5, fat: 0, servingLabel: "30g", category: "Clear" },
      // Vegan
      { name: "Designer Plant Based Protein", calories: 119, protein: 21, carbs: 3.6, fat: 2.1, servingLabel: "30g", category: "Vegan" },
      // Protein Kaffee & Spezialshakes (30g, mit Milch mischbar)
      { name: "Flexpresso Protein Kaffee", calories: 110, protein: 23, carbs: 2.5, fat: 1.1, servingLabel: "30g", category: "Shake" },
      { name: "Veganer Flexpresso Protein Kaffee", calories: 111, protein: 24, carbs: 2.8, fat: 0.2, servingLabel: "30g", category: "Shake" },
      { name: "Protein Cold Brew", calories: 105, protein: 24, carbs: 1.7, fat: 0.5, servingLabel: "30g", category: "Shake" },
      { name: "Protein Matcha", calories: 113, protein: 23, carbs: 1.8, fat: 1.3, servingLabel: "30g", category: "Shake" },
      // Frühstück & Mahlzeiten
      { name: "Protein Porridge", calories: 211, protein: 31, carbs: 15, fat: 2.1, servingLabel: "60g", category: "Special" },
      { name: "Designer Reispudding", calories: 219, protein: 5, carbs: 49, fat: 0.6, servingLabel: "60g", category: "Special" },
      { name: "Designer Protein Pancake & Waffle Mix", calories: 117, protein: 15, carbs: 9.8, fat: 1.6, servingLabel: "100g (zubereitet)", category: "Special" },
      // Riegel & Snacks
      { name: "Designer Bar Proteinriegel", calories: 241, protein: 19, carbs: 21, fat: 11, servingLabel: "60g", category: "Riegel" },
      { name: "GOAT Bar", calories: 235, protein: 15, carbs: 24, fat: 8, servingLabel: "60g", category: "Riegel" },
      { name: "Designer Oatbar", calories: 323, protein: 4, carbs: 37, fat: 18, servingLabel: "70g", category: "Riegel" },
      // Aufstriche & Fette
      { name: "Erdnussbutter", calories: 182, protein: 9, carbs: 3.6, fat: 14, servingLabel: "30g", category: "Extras" },
      { name: "Designer Protein Spread", calories: 166, protein: 6, carbs: 9.3, fat: 13, servingLabel: "30g", category: "Extras" },
      // Flavor & Süßen
      { name: "Designer Flavour Powder", calories: 24, protein: 0.1, carbs: 2.5, fat: 0.1, servingLabel: "10g", category: "Extras" },
      { name: "Ultra Syrup", calories: 0, protein: 0, carbs: 0.1, fat: 0, servingLabel: "15ml", category: "Extras" },
      { name: "2 Kalorien Ölspray", calories: 2, protein: 0, carbs: 0, fat: 0.2, servingLabel: "1 Sprüh", category: "Extras" },
      // Kohlenhydrate & Performance-Food
      { name: "Ultrapure Maltodextrin", calories: 116, protein: 0, carbs: 29, fat: 0, servingLabel: "30g", category: "Special" },
      { name: "Ultrapure Cyclic Dextrin", calories: 114, protein: 0, carbs: 29, fat: 0, servingLabel: "30g", category: "Special" },
      { name: "Perfect Carb Loader", calories: 186, protein: 0, carbs: 46, fat: 0, servingLabel: "50g", category: "Special" },
      { name: "Rice Crispies", calories: 117, protein: 2.2, carbs: 25, fat: 0.7, servingLabel: "30g", category: "Special" },
      { name: "HydroLoad Electrolytes", calories: 30, protein: 0, carbs: 7, fat: 0, servingLabel: "10g", category: "Extras" },
      { name: "Perfect NRGY Hydro Energy Gel", calories: 81, protein: 0, carbs: 20, fat: 0, servingLabel: "1 Gel (40g)", category: "Extras" },
      { name: "Crank Energy Drink", calories: 10, protein: 0, carbs: 0, fat: 0, servingLabel: "250ml", category: "Extras" },
      { name: "Perfect Rec", calories: 180, protein: 12, carbs: 30, fat: 0, servingLabel: "60g", category: "Special" },
      // Performance Supplements (0 kcal)
      { name: "EAA+", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Portion", category: "Extras" },
      { name: "Elite Aminos", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Portion", category: "Extras" },
      { name: "Beta Alanine", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Portion", category: "Extras" },
      { name: "Ultrapure L-Citrulline", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "3g", category: "Extras" },
      { name: "Ultrapure L-Glutamin", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "5g", category: "Extras" },
      { name: "Ultrapure Kreatin", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "5g", category: "Extras" },
      { name: "Kreatin Gummies", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Portion", category: "Extras" },
      { name: "Crank Ultimate (Pre-Workout)", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Portion", category: "Extras" },
      { name: "Crank Pump Pro 2.0", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Portion", category: "Extras" },
      { name: "Perfect Pre", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Portion", category: "Extras" },
      { name: "Intra Workout", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Portion", category: "Extras" },
      // Vitalstoffe
      { name: "Vitamin D3+K2 Depot", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Kapsel", category: "Extras" },
      { name: "Omega-3 Kapseln", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Kapsel", category: "Extras" },
      { name: "Magnesium Complex", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Portion", category: "Extras" },
      { name: "Ashwagandha Kapseln", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Kapsel", category: "Extras" },
      { name: "Melatonin (Sleep)", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Kapsel", category: "Extras" },
    ],
  },
  {
    name: "Optimum Nutrition",
    emoji: "⭐",
    color: "rgba(240,180,0,0.1)",
    products: [
      // Gold Standard Whey
      { name: "Gold Standard Whey – Double Rich Choco", calories: 120, protein: 24, carbs: 3.0, fat: 1.5, servingLabel: "30g", category: "Whey" },
      { name: "Gold Standard Whey – Vanilla Ice Cream", calories: 118, protein: 24, carbs: 2.5, fat: 1.5, servingLabel: "30g", category: "Whey" },
      { name: "Gold Standard Whey – Strawberry", calories: 119, protein: 24, carbs: 2.8, fat: 1.5, servingLabel: "30g", category: "Whey" },
      { name: "Gold Standard Whey – Banana Cream", calories: 117, protein: 24, carbs: 2.5, fat: 1.4, servingLabel: "30g", category: "Whey" },
      { name: "Gold Standard Whey – Chocolate Mint", calories: 120, protein: 24, carbs: 3.0, fat: 1.5, servingLabel: "30g", category: "Whey" },
      { name: "Gold Standard Whey – Mocha Cappuccino", calories: 121, protein: 24, carbs: 3.2, fat: 1.5, servingLabel: "30g", category: "Whey" },
      { name: "Gold Standard Whey – Chocolate Hazelnut", calories: 122, protein: 23, carbs: 3.5, fat: 1.8, servingLabel: "30g", category: "Whey" },
      { name: "Gold Standard Whey – Cake Batter", calories: 123, protein: 23, carbs: 3.8, fat: 1.8, servingLabel: "30g", category: "Whey" },
      { name: "Gold Standard Whey – Rocky Road", calories: 121, protein: 23, carbs: 3.2, fat: 1.7, servingLabel: "30g", category: "Whey" },
      { name: "Gold Standard Whey – Cookies & Cream", calories: 124, protein: 23, carbs: 3.8, fat: 2.0, servingLabel: "30g", category: "Whey" },
      // Platinum Hydrowhey
      { name: "Platinum Hydrowhey – Turbo Choco", calories: 140, protein: 30, carbs: 2.0, fat: 2.0, servingLabel: "39g", category: "Premium" },
      { name: "Platinum Hydrowhey – Vanilla", calories: 138, protein: 30, carbs: 1.8, fat: 2.0, servingLabel: "39g", category: "Premium" },
      // Gold Standard Casein
      { name: "Gold Standard Casein – Chocolate Supremacy", calories: 120, protein: 24, carbs: 3.5, fat: 1.0, servingLabel: "33g", category: "Casein" },
      { name: "Gold Standard Casein – Chocolate Peanut Butter", calories: 122, protein: 24, carbs: 3.8, fat: 1.2, servingLabel: "33g", category: "Casein" },
      { name: "Gold Standard Casein – Vanilla", calories: 118, protein: 24, carbs: 3.0, fat: 1.0, servingLabel: "33g", category: "Casein" },
      // Weight Gainer
      { name: "Serious Mass – Chocolate", calories: 388, protein: 31, carbs: 67, fat: 4.0, servingLabel: "100g", category: "Gainer" },
      { name: "Serious Mass – Vanilla", calories: 385, protein: 31, carbs: 66, fat: 4.0, servingLabel: "100g", category: "Gainer" },
      { name: "Serious Mass – Strawberry", calories: 386, protein: 31, carbs: 66, fat: 4.0, servingLabel: "100g", category: "Gainer" },
      // Amino Energy
      { name: "Amino Energy – Green Apple", calories: 15, protein: 5.0, carbs: 1.0, fat: 0, servingLabel: "9g", category: "Aminos" },
      { name: "Amino Energy – Grape", calories: 15, protein: 5.0, carbs: 1.0, fat: 0, servingLabel: "9g", category: "Aminos" },
      { name: "Amino Energy – Peach Lemonade", calories: 15, protein: 5.0, carbs: 1.0, fat: 0, servingLabel: "9g", category: "Aminos" },
      { name: "Amino Energy – Blueberry Mojito", calories: 15, protein: 5.0, carbs: 1.0, fat: 0, servingLabel: "9g", category: "Aminos" },
      // Extras
      { name: "Micronized Creatine", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "5g", category: "Extras" },
      { name: "Gold Standard Pre-Workout", calories: 25, protein: 0, carbs: 6.0, fat: 0, servingLabel: "10g", category: "Extras" },
      { name: "Opti-Men Multivitamin", calories: 5, protein: 0, carbs: 1.0, fat: 0, servingLabel: "3 Tabletten", category: "Extras" },
      { name: "Opti-Women Multivitamin", calories: 5, protein: 0, carbs: 1.0, fat: 0, servingLabel: "2 Kapseln", category: "Extras" },
      { name: "Superior Amino 2222", calories: 18, protein: 4.5, carbs: 0, fat: 0, servingLabel: "4 Tabletten", category: "Aminos" },
      { name: "Omega-3", calories: 10, protein: 0, carbs: 0, fat: 1.0, servingLabel: "1 Kapsel", category: "Extras" },
    ],
  },
  {
    name: "Body Attack",
    emoji: "🔴",
    color: "rgba(220,30,30,0.1)",
    products: [
      // Protein
      { name: "Power Protein 90 – Vanille", calories: 115, protein: 22, carbs: 4.0, fat: 1.8, servingLabel: "30g", category: "Whey" },
      { name: "Power Protein 90 – Schokolade", calories: 117, protein: 22, carbs: 4.5, fat: 1.9, servingLabel: "30g", category: "Whey" },
      { name: "Power Protein 90 – Strawberry", calories: 114, protein: 22, carbs: 3.8, fat: 1.7, servingLabel: "30g", category: "Whey" },
      { name: "Power Protein 90 – Banana", calories: 115, protein: 22, carbs: 4.0, fat: 1.8, servingLabel: "30g", category: "Whey" },
      { name: "Extreme Whey Deluxe – Chocolate", calories: 121, protein: 24, carbs: 3.0, fat: 2.0, servingLabel: "30g", category: "Whey" },
      { name: "Extreme Whey Deluxe – Vanilla", calories: 119, protein: 24, carbs: 2.5, fat: 2.0, servingLabel: "30g", category: "Whey" },
      { name: "Natural Protein – Vanilla", calories: 112, protein: 23, carbs: 2.5, fat: 1.5, servingLabel: "30g", category: "Natural" },
      { name: "Natural Protein – Chocolate", calories: 114, protein: 23, carbs: 3.0, fat: 1.5, servingLabel: "30g", category: "Natural" },
      { name: "Vegan Protein 400 – Schokolade", calories: 116, protein: 22, carbs: 4.5, fat: 2.0, servingLabel: "30g", category: "Vegan" },
      { name: "Vegan Protein 400 – Vanilla", calories: 114, protein: 22, carbs: 4.0, fat: 2.0, servingLabel: "30g", category: "Vegan" },
      // Riegel & Snacks
      { name: "High Protein Bar – Chocolate", calories: 190, protein: 22, carbs: 13, fat: 5.0, servingLabel: "60g", category: "Riegel" },
      { name: "High Protein Bar – Caramel", calories: 192, protein: 22, carbs: 14, fat: 5.0, servingLabel: "60g", category: "Riegel" },
      { name: "High Protein Bar – Strawberry", calories: 188, protein: 22, carbs: 13, fat: 4.8, servingLabel: "60g", category: "Riegel" },
      { name: "Protein Mousse – Chocolate", calories: 155, protein: 20, carbs: 8.0, fat: 4.0, servingLabel: "50g", category: "Riegel" },
      { name: "Slim Body Shake – Schokolade", calories: 185, protein: 22, carbs: 16, fat: 3.5, servingLabel: "55g", category: "Shake" },
      // Extras
      { name: "Creatine Creapure", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "5g", category: "Extras" },
      { name: "BCAA Shock", calories: 20, protein: 5.0, carbs: 0, fat: 0, servingLabel: "10g", category: "Extras" },
      { name: "EAA Shock", calories: 20, protein: 6.0, carbs: 0, fat: 0, servingLabel: "10g", category: "Extras" },
      { name: "L-Carnitin", calories: 5, protein: 0, carbs: 1.0, fat: 0, servingLabel: "1 Kapsel", category: "Extras" },
      { name: "Omega-3 Softgels", calories: 10, protein: 0, carbs: 0, fat: 1.0, servingLabel: "1 Kapsel", category: "Extras" },
      { name: "Vitamin D3+K2", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "1 Kapsel", category: "Extras" },
      { name: "Pre-Workout Power", calories: 20, protein: 0, carbs: 5.0, fat: 0, servingLabel: "10g", category: "Extras" },
    ],
  },
  {
    name: "Peak",
    emoji: "⛰️",
    color: "rgba(30,60,200,0.1)",
    products: [
      { name: "Peak Whey – Chocolate", calories: 110, protein: 23, carbs: 3.5, fat: 1.5, servingLabel: "30g", category: "Whey" },
      { name: "Peak Whey – Vanilla", calories: 108, protein: 23, carbs: 3.0, fat: 1.5, servingLabel: "30g", category: "Whey" },
      { name: "Peak Whey – Strawberry", calories: 109, protein: 23, carbs: 3.2, fat: 1.5, servingLabel: "30g", category: "Whey" },
      { name: "Peak Whey Isolate – Chocolate", calories: 99, protein: 24, carbs: 1.5, fat: 0.5, servingLabel: "27g", category: "Isolat" },
      { name: "Peak Whey Isolate – Vanilla", calories: 97, protein: 24, carbs: 1.2, fat: 0.5, servingLabel: "27g", category: "Isolat" },
      { name: "Peak Vegan Protein – Chocolate", calories: 118, protein: 22, carbs: 5.0, fat: 2.0, servingLabel: "33g", category: "Vegan" },
      { name: "Peak Protein Bar – Choco Brownie", calories: 198, protein: 20, carbs: 16, fat: 6.0, servingLabel: "67g", category: "Riegel" },
      { name: "Peak Protein Bar – Vanilla", calories: 195, protein: 20, carbs: 15, fat: 6.0, servingLabel: "67g", category: "Riegel" },
      { name: "Peak Creatine", calories: 0, protein: 0, carbs: 0, fat: 0, servingLabel: "5g", category: "Extras" },
      { name: "Peak BCAA", calories: 18, protein: 4.5, carbs: 0, fat: 0, servingLabel: "10g", category: "Extras" },
      { name: "Peak Pre-Workout", calories: 25, protein: 0, carbs: 6.0, fat: 0, servingLabel: "10g", category: "Extras" },
    ],
  },
  {
    name: "Eigenes Supplement",
    emoji: "✏️",
    color: "rgba(140,60,200,0.1)",
    products: [],
  },
];

const CATEGORIES = ["Alle", "Whey", "Isolat", "Casein", "Clear", "Vegan", "Premium", "Riegel", "Shake", "Snacks", "Aminos", "Extras", "Special", "Natural", "Gainer"];
const POWDER_CATEGORIES = ["Whey", "Isolat", "Casein", "Clear", "Vegan", "Premium", "Special", "Shake", "Natural"];

const LIQUIDS = [
  { id: "water",      name: "Wasser",        emoji: "💧", cal: 0,  p: 0,   c: 0,   f: 0,   mlLabel: "300ml", defaultMl: 300 },
  { id: "vollmilch",  name: "Vollmilch",     emoji: "🥛", cal: 64, p: 3.3, c: 4.7, f: 3.5, mlLabel: "200ml", defaultMl: 200 },
  { id: "halbfett",   name: "1,5% Milch",    emoji: "🥛", cal: 46, p: 3.3, c: 4.7, f: 1.5, mlLabel: "200ml", defaultMl: 200 },
  { id: "laktosefrei",name: "Laktosefrei",   emoji: "🥛", cal: 49, p: 3.4, c: 4.9, f: 1.7, mlLabel: "200ml", defaultMl: 200 },
  { id: "hafermilch", name: "Hafermilch",    emoji: "🌾", cal: 44, p: 1.0, c: 7.5, f: 1.0, mlLabel: "200ml", defaultMl: 200 },
  { id: "mandelmilch",name: "Mandelmilch",   emoji: "🌰", cal: 24, p: 0.4, c: 3.6, f: 1.2, mlLabel: "200ml", defaultMl: 200 },
  { id: "kokosmilch", name: "Kokosmilch",    emoji: "🥥", cal: 23, p: 0.2, c: 3.8, f: 0.6, mlLabel: "200ml", defaultMl: 200 },
  { id: "sojamilch",  name: "Sojamilch",     emoji: "🫘", cal: 44, p: 3.6, c: 3.2, f: 1.8, mlLabel: "200ml", defaultMl: 200 },
];
const ML_OPTIONS = [150, 200, 250, 300, 350, 400];

type MealType = "breakfast" | "lunch" | "dinner" | "snack";
const MEAL_TYPES: { val: MealType; label: string }[] = [
  { val: "breakfast", label: "Frühstück" },
  { val: "lunch", label: "Mittagessen" },
  { val: "dinner", label: "Abendessen" },
  { val: "snack", label: "Snack" },
];

export function SupplementLogger({ userId }: { userId: string }) {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mealType, setMealType] = useState<MealType>("snack");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [manual, setManual] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  const [activeCategory, setActiveCategory] = useState("Alle");
  const [search, setSearch] = useState("");
  const [scoops, setScoops] = useState(1);
  const [liquid, setLiquid] = useState(LIQUIDS[0]);
  const [liquidMl, setLiquidMl] = useState(300);
  const router = useRouter();

  const isManual = selectedBrand?.name === "Eigenes Supplement";
  const isPowder = !!selectedProduct && POWDER_CATEGORIES.includes(selectedProduct.category);

  const totalMacros = selectedProduct && isPowder ? {
    calories: Math.round(selectedProduct.calories * scoops + liquid.cal * liquidMl / 100),
    protein: Math.round((selectedProduct.protein * scoops + liquid.p * liquidMl / 100) * 10) / 10,
    carbs:   Math.round((selectedProduct.carbs   * scoops + liquid.c * liquidMl / 100) * 10) / 10,
    fat:     Math.round((selectedProduct.fat     * scoops + liquid.f * liquidMl / 100) * 10) / 10,
  } : selectedProduct ? {
    calories: selectedProduct.calories,
    protein: selectedProduct.protein,
    carbs: selectedProduct.carbs,
    fat: selectedProduct.fat,
  } : null;

  const filteredProducts = selectedBrand?.products.filter((p) => {
    const matchCat = activeCategory === "Alle" || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }) ?? [];

  const availableCategories = selectedBrand
    ? ["Alle", ...Array.from(new Set(selectedBrand.products.map((p) => p.category)))]
    : [];

  const handleLog = async () => {
    const supabase = createClient();
    setSaving(true);

    if (isManual) {
      await supabase.from("meal_logs").insert({
        user_id: userId,
        name: manual.name || "Supplement",
        calories: Number(manual.calories) || 0,
        protein: Number(manual.protein) || 0,
        carbs: Number(manual.carbs) || 0,
        fat: Number(manual.fat) || 0,
        meal_type: mealType,
      });
    } else if (selectedProduct && totalMacros) {
      const nameSuffix = isPowder && liquid.id !== "water"
        ? ` (${scoops}x + ${liquidMl}ml ${liquid.name})`
        : scoops > 1 ? ` (${scoops}x)` : "";
      await supabase.from("meal_logs").insert({
        user_id: userId,
        name: selectedProduct.name + nameSuffix,
        calories: totalMacros.calories,
        protein: totalMacros.protein,
        carbs: totalMacros.carbs,
        fat: totalMacros.fat,
        meal_type: mealType,
      });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSelectedProduct(null);
      setSearch("");
      setManual({ name: "", calories: "", protein: "", carbs: "", fat: "" });
      router.push("/dashboard");
    }, 1200);
  };

  const canLog = isManual ? !!manual.name && !!manual.calories : !!selectedProduct;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    background: "var(--bg-hover)", border: "1px solid var(--border)",
    borderRadius: "10px", color: "var(--text-primary)", fontSize: "14px", outline: "none",
  };

  return (
    <div>
      {!selectedBrand ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {BRANDS.map((b) => (
            <button key={b.name} onClick={() => { setSelectedBrand(b); setActiveCategory("Alle"); setSearch(""); }}
              style={{ background: b.color, border: "1px solid var(--border)", borderRadius: "14px", padding: "18px 14px", textAlign: "left", cursor: "pointer" }}>
              <div style={{ fontSize: "26px", marginBottom: "8px" }}>{b.emoji}</div>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "2px" }}>{b.name}</div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{b.products.length > 0 ? `${b.products.length} Produkte` : "Manuell eingeben"}</div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          {/* Back + header */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <button onClick={() => { setSelectedBrand(null); setSelectedProduct(null); }}
              style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "20px", cursor: "pointer", padding: "0", lineHeight: 1 }}>←</button>
            <span style={{ fontSize: "18px" }}>{selectedBrand.emoji}</span>
            <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>{selectedBrand.name}</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "auto" }}>{selectedBrand.products.length} Produkte</span>
          </div>

          {isManual ? (
            <div>
              {[
                { key: "name", label: "Produktname *", placeholder: "z.B. Protein Shake XY", type: "text" },
                { key: "calories", label: "Kalorien (kcal) *", placeholder: "120", type: "number" },
                { key: "protein", label: "Protein (g)", placeholder: "25", type: "number" },
                { key: "carbs", label: "Kohlenhydrate (g)", placeholder: "3", type: "number" },
                { key: "fat", label: "Fett (g)", placeholder: "2", type: "number" },
              ].map((f) => (
                <div key={f.key} style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block", marginBottom: "5px" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={manual[f.key as keyof typeof manual]}
                    onChange={(e) => setManual((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    style={inputStyle} />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Search */}
              <input placeholder={`${selectedBrand.name} Produkt suchen…`} value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...inputStyle, marginBottom: "10px" }} />

              {/* Category filter */}
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", marginBottom: "12px", paddingBottom: "2px" }}>
                {availableCategories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    style={{ flexShrink: 0, padding: "5px 12px", fontSize: "11px", background: activeCategory === cat ? "var(--accent-bg)" : "var(--bg-card)", border: activeCategory === cat ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "99px", color: activeCategory === cat ? "var(--accent-light)" : "var(--text-secondary)", cursor: "pointer" }}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Product list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px", maxHeight: "50vh", overflowY: "auto" }}>
                {filteredProducts.length === 0 && (
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>Keine Produkte gefunden</p>
                )}
                {filteredProducts.map((p) => {
                  const sel = selectedProduct?.name === p.name;
                  return (
                    <button key={p.name} onClick={() => setSelectedProduct(sel ? null : p)}
                      style={{ background: sel ? "var(--accent-bg)" : "var(--bg-card)", border: sel ? "1px solid rgba(29,158,117,0.5)" : "1px solid var(--border)", borderRadius: "10px", padding: "10px 12px", textAlign: "left", cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", flex: 1, marginRight: "8px" }}>{p.name}</span>
                        {sel && <span style={{ fontSize: "12px", color: "var(--accent-light)", flexShrink: 0 }}>✓</span>}
                      </div>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "11px", color: "var(--accent-light)", fontWeight: 500 }}>{p.calories} kcal</span>
                        <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>P: {p.protein}g</span>
                        <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>K: {p.carbs}g</span>
                        <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>F: {p.fat}g</span>
                        <span style={{ fontSize: "10px", color: "var(--border-hover)", marginLeft: "auto" }}>{p.servingLabel}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Scoop + Liquid (only for powder products) */}
          {selectedProduct && isPowder && (
            <div style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px", marginBottom: "12px" }}>
              {/* Scoops */}
              <div style={{ marginBottom: "12px" }}>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: "8px" }}>ANZAHL SCOOPS</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[1, 2, 3].map((n) => (
                    <button key={n} onClick={() => setScoops(n)}
                      style={{ flex: 1, padding: "8px 0", background: scoops === n ? "var(--accent-bg)" : "var(--bg-card)", border: scoops === n ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "8px", color: scoops === n ? "var(--accent-light)" : "var(--text-secondary)", fontSize: "13px", fontWeight: scoops === n ? 500 : 400, cursor: "pointer" }}>
                      {n}× {selectedProduct.servingLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Liquid type */}
              <div style={{ marginBottom: "10px" }}>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: "8px" }}>FLÜSSIGKEIT</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {LIQUIDS.map((l) => (
                    <button key={l.id} onClick={() => { setLiquid(l); setLiquidMl(l.defaultMl); }}
                      style={{ padding: "6px 10px", background: liquid.id === l.id ? "var(--accent-bg)" : "var(--bg-card)", border: liquid.id === l.id ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "8px", color: liquid.id === l.id ? "var(--accent-light)" : "var(--text-secondary)", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span>{l.emoji}</span> {l.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Liquid ml */}
              {liquid.id !== "water" && (
                <div style={{ marginBottom: "10px" }}>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: "8px" }}>MENGE</p>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {ML_OPTIONS.map((ml) => (
                      <button key={ml} onClick={() => setLiquidMl(ml)}
                        style={{ flex: 1, padding: "6px 0", background: liquidMl === ml ? "var(--accent-bg)" : "var(--bg-card)", border: liquidMl === ml ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "8px", color: liquidMl === ml ? "var(--accent-light)" : "var(--text-secondary)", fontSize: "10px", cursor: "pointer" }}>
                        {ml}ml
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Total macros preview */}
              {totalMacros && (
                <div style={{ background: "var(--bg-card)", borderRadius: "8px", padding: "10px 12px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "12px", color: "var(--accent-light)", fontWeight: 500 }}>{totalMacros.calories} kcal</span>
                  <span style={{ fontSize: "11px", color: "#1D9E75" }}>P: {totalMacros.protein}g</span>
                  <span style={{ fontSize: "11px", color: "#5B8DD9" }}>K: {totalMacros.carbs}g</span>
                  <span style={{ fontSize: "11px", color: "#EF9F27" }}>F: {totalMacros.fat}g</span>
                  {liquid.id !== "water" && <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "auto" }}>inkl. {liquidMl}ml {liquid.name}</span>}
                </div>
              )}
            </div>
          )}

          {/* Meal type */}
          {canLog && (
            <div style={{ marginBottom: "12px" }}>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.5px" }}>ALS MAHLZEIT EINTRAGEN</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {MEAL_TYPES.map((t) => (
                  <button key={t.val} onClick={() => setMealType(t.val)}
                    style={{ flex: 1, minWidth: "70px", padding: "7px 4px", fontSize: "11px", background: mealType === t.val ? "var(--accent-bg)" : "var(--bg-card)", border: mealType === t.val ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "8px", color: mealType === t.val ? "var(--accent-light)" : "var(--text-secondary)", cursor: "pointer" }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleLog} disabled={!canLog || saving || saved}
            className={canLog ? "glow-green" : ""}
            style={{ width: "100%", padding: "14px", background: saved ? "#1D9E75" : canLog ? "linear-gradient(135deg,#1D9E75,#16835f)" : "var(--bg-hover)", border: "none", borderRadius: "12px", color: canLog ? "#fff" : "var(--text-muted)", fontSize: "15px", fontWeight: 500, cursor: canLog && !saving ? "pointer" : "default" }}>
            {saved ? "✓ Geloggt! Zurück…" : saving ? "Wird geloggt…" : canLog ? `💊 ${totalMacros?.calories ?? ""} kcal als ${MEAL_TYPES.find((t) => t.val === mealType)?.label} loggen` : "Produkt auswählen"}
          </button>
        </div>
      )}
    </div>
  );
}
