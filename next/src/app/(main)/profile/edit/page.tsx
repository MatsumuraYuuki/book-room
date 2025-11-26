'use client';

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'
import Image from 'next/image';
import { api } from '@/lib/api';
import { User } from '@/types/common';

// フォームのデータ型
interface FormData {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  // imageはファイルなので、ここには含めない
}


export default function ProfileEditPage() {
  // 状態管理
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
  const queryClient = useQueryClient();

  const { data: user = null, isLoading: loading, error } = useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await api.get('/current/user');
      return response.data;
    }
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [user, setValue]);

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

  // フォーム送信処理
  const onSubmit = async (data: FormData) => {
    try {
      // パスワード確認チェック
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        toast.error('新しいパスワードと確認用パスワードが一致しません');
        return;
      }

      // FormDataオブジェクトを作成
      const formData = new FormData();
      formData.append('user[name]', data.name);
      formData.append('user[email]', data.email);

      // 画像が選択されていれば追加
      if (selectedImage) {
        formData.append('user[image]', selectedImage);
      }

      // パスワード変更が入力されている場合のみ追加
      if (data.currentPassword && data.newPassword) {
        formData.append('user[current_password]', data.currentPassword);
        formData.append('user[password]', data.newPassword);
        formData.append('user[password_confirmation]', data.confirmPassword || '');
      }

      // APIにPATCHリクエストを送信
      await api.patch("current/user", formData, {
        headers: {
          "Content-Type": 'multipart/form-data',
        }
      });

      // キャッシュを再取得してプロフィールページにリダイレクト
      queryClient.invalidateQueries({ queryKey: ["user"] })
      router.push("/profile");
      toast.success('ユーザー情報を変更しました')
    } catch (error) {
      console.error('更新失敗:', error);
      toast.error('更新に失敗しました')
    }
  };

  // 取得中の場合は早期リターンで別の画面を表示
  if (loading) {
    return <div>読み込み中...</div>;
  }
  // エラー時の表示
  if (error) {
    return <div>エラーが発生しました</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* プロフィール画像セクション */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">プロフィール画像</h2>

          {/* 画像プレビュー */}
          <div className="flex gap-8 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">現在の画像</p>
              <Image
                className="w-24 h-24 object-cover rounded-full"
                src={user?.imageUrl || "/default-avatar.png"}
                alt="現在のプロフィール画像"
                width={96}
                height={96}
              />
            </div>

            {previewUrl && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">更新後の画像</p>
                <Image
                  className="w-24 h-24 object-cover rounded-full"
                  src={previewUrl}
                  alt="更新後のプロフィール画像"
                  width={96}
                  height={96}
                />
              </div>
            )}
          </div>

          {/* 画像アップロード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              画像を選択
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* 基本情報セクション */}
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h2>

          {/* ユーザー名 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              ユーザー名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name', { required: 'ユーザー名を入力してください' })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* メールアドレス */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'メールアドレスを入力してください',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '有効なメールアドレスを入力してください'
                }
              })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* パスワード変更セクション */}
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">パスワード変更</h2>
          <p className="text-sm text-gray-600 mb-4">パスワードを変更する場合のみ入力してください</p>

          {/* 現在のパスワード */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              現在のパスワード
            </label>
            <input
              type="password"
              {...register('currentPassword')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 新しいパスワード */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              新しいパスワード
            </label>
            <input
              type="password"
              {...register('newPassword', {
                minLength: {
                  value: 6,
                  message: 'パスワードは6文字以上で入力してください'
                }
              })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          {/* 新しいパスワード（確認） */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              新しいパスワード（確認）
            </label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* ボタン */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            更新する
          </button>
          <button
            type="button"
            onClick={() => router.push('/profile')}
            className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}