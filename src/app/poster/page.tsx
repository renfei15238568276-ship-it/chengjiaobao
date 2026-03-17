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
        <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>成交宝</h1>
        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px', lineHeight: 1.6 }}>
          让每一个销售机会都不再流失
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#10b981' }}>客户管理</span>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#10b981' }}>AI 话术</span>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#10b981' }}>智能提醒</span>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#10b981' }}>成交统计</span>
        </div>
        
        <div style={{ fontSize: '36px', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>免费注册</div>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
          无需下载，浏览器直接用
        </p>
        
        <div style={{ paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '160px', height: '160px', background: 'white', borderRadius: '16px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '14px' }}>扫码注册</div>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}>客服微信：<span style={{ color: '#10b981', fontWeight: 600 }}>r18974670134</span></p>
        </div>
      </div>
    </div>
  );
}
