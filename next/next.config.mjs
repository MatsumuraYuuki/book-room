/** @type {import('next').NextConfig} */
const nextConfig = {
  // image_url が Active Storage のパスなので、Next.js の設定が必要かもしれません。
  //  Active Storage の画像パスの問題
  // Active Storage が返す image_url は：
  // /rails/active_storage/blobs/...
  // これは Rails サーバー（localhost:3000）のパス です。
  // でも Next.js の <Image> コンポーネントは、デフォルトで 同じドメイン（localhost:8000）の画像 しか扱えません。

  images: {
    remotePatterns: [
      // 開発環境: ローカル Rails サーバー
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/rails/active_storage/**',
      },
      // Docker開発環境: Railsコンテナ
      {
        protocol: 'http',
        hostname: 'rails',
        port: '3000',
        pathname: '/rails/active_storage/**',
      },
      // 本番環境: AWS S3
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',  // S3 のドメイン（ワイルドカード）
        pathname: '/**',
      },
      // 本番環境: AWS S3（代替形式）
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',  // リージョン指定の S3 ドメイン
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
