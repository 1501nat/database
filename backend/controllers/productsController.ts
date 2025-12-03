import { Request, Response } from "express";
import db from "../config/db";

export const getProducts = (req: Request, res: Response): void => {
    db.query("SELECT * FROM products", (err: any, result: any[]) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

export const addProduct = (req: Request, res: Response): void => {
    const { name, price } = req.body;

    db.query(
        "INSERT INTO products (name, price) VALUES (?, ?)",
        [name, price],
        (err: any, result: any) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Thêm sản phẩm thành công" });
        }
    );
};
