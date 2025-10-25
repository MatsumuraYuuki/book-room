'use client';

import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import Image from 'next/image';

// フォームのデータ型
interface FormData {
  name: string;
  // imageはファイルなので、ここには含めない
}

type User = {
  name: string,
  email: string,
  id: number,
  image_url?: string
}


export default function ProfileEditPage() {
  // 状態管理
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl,] = useState<string>('');

  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

  // TODO: ユーザー情報を取得する useEffect
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/current/user")
        setUser(response.data)
        setValue('name', response.data.name)
      } catch (error) {
        console.error('取得失敗:', error);
      } finally {
        setLoading(false)
      }
    }
    fetchUser();
  }, [])

  // TODO: 画像が選択されたときの処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. ファイルを状態に保存 *フォーム送信処理で使います
      setSelectedImage(file);
      // 2. プレビューURLを生成
      const url = URL.createObjectURL(file);
      // 3. プレビューURLを状態に保存
      setPreviewUrl(url);
    }
  };
  // TODO: フォーム送信処理

  const onSubmit = async (data: FormData) => {
    try {
      // 1. FormDataオブジェクトを作成
      const formData = new FormData();
      // 2. ユーザー名を追加
      formData.append('user[name]', data.name);
      // 3. 画像が選択されていれば追加
      if (selectedImage) {
        formData.append('user[image]', selectedImage);
      }
      // 4. APIにPATCHリクエストを送信
      await api.patch("current/user", formData, {
        headers: {
          "Content-Type": 'multipart/form-data',  //画像ファイル用の形式
        }
      });
      // 5. 成功したら /profileにリダイレクト
      router.push("/profile");

    } catch (error) {
      console.error('更新失敗:', error);
    }
  };
  
  // 取得中の場合は早期リターンで別の画面を表示
  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">プロフィール編集</h1>
      {/* TODO: フォームを作る */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 画像プレビュー */}
        <div className="flex gap-8">
          {/* 左側: 現在の画像 */}
          <div>
            <p>現在の画像</p>
            <Image
              className="w-24 h-24 object-cover rounded-full"
              src={user?.image_url || "/default-avatar.png"}
              alt="現在のプロフィール画像"
              width={96}
              height={96}
            />            
          </div>
          {/* 右側: プレビュー画像（選択された場合のみ表示） */}
          {previewUrl && (
            <div>
            <p>更新後の画像</p>
            <Image
              className="w-24 h-24 object-cover rounded-full"
              src={previewUrl || "/default-avatar.png"}
              alt="更新後のプロフィール画像"
              width={96}
              height={96}
            />                 
            </div>
          )}
        </div>

        {/* 画像アップロード */}
        <div>
          <label>プロフィール画像</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            />
        </div>

        {/* ユーザー名入力 */}
        <div>
          {/* TODO: ユーザー名の入力フィールド */}
          <label htmlFor="name">ユーザー名</label>
          <input type="text"
          {...register('name', { required: 'ユーザー名を入力してください' })}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        {/* エラーメッセージ表示 */}
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        
        </div>
        {/* 送信ボタン */}
        <button type="submit" className="border boreder-black">更新</button>
      </form>
    </div>
  );
}