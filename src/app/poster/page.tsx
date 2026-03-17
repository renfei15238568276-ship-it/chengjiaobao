export default function PosterPage() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #07111f 0%, #0f2942 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      margin: 0,
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #0a1628 0%, #07111f 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '32px',
        padding: '60px 48px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '20px',
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          fontWeight: 'bold'
        }}>✓</div>
        <h1 style={{ fontSize: '42px', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>成交宝</h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px', lineHeight: 1.6 }}>
          成交宝 / 用户注册<br />
          先把账号注册体系跑起来，再往多用户隔离和年费上接。<br />
          这一版先把"能注册进数据库"做实。登录、登录态和用户隔离，下一刀继续接。
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#10b981' }}>客户管理</span>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#10b981' }}>AI 成交助手</span>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#10b981' }}>跟进提醒</span>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#10b981' }}>成交看板</span>
        </div>
        <div style={{ fontSize: '48px', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>免费注册</div>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
          注册后会写入 Supabase 的 users 表<br />默认角色：user | 免费注册，立即使用
        </p>
        <div style={{ paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '160px', height: '160px', background: 'white', borderRadius: '16px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '14px' }}>扫码注册</div>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}>客服微信：<span style={{ color: '#10b981', fontWeight: 600 }}>r18974670134</span></p>
        </div>
      </div>
    </div>
  );
}
