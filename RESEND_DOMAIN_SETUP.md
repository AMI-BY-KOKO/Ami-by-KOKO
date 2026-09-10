# Resend Custom Domain Setup Guide

This guide covers how to configure Resend with your custom email domain (`amibykoko.app`) to send branded emails instead of using `@resend.dev`.

---

## 📋 **What You'll Get**

**Before:**
```
from: Àmì by Kòkò <noreply@resend.dev>
```

**After (once configured):**
```
from: Àmì by Kòkò <noreply@amibykoko.app>
```

---

## 🧩 **Prerequisites**

1. ✅ Resend API key configured (DONE)
2. ✅ Custom domain: `amibykoko.app`
3. ✅ Access to your domain registrar (where you bought the domain)
4. ✅ Ability to add DNS records

---

## 🚀 **Step-by-Step Setup**

### **Step 1: Add Environment Variables**

These are already added to `.env.local`:

```env
RESEND_API_KEY="re_5hN6EmB8_LBGJjXm4RCQHuFbQ3dGpqwaN"
RESEND_FROM_EMAIL="noreply@amibykoko.app"
RESEND_FROM_NAME="Àmì by Kòkò"
```

**For Vercel deployment:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select **ami-by-koko** project
3. Navigate to **Settings → Environment Variables**
4. Add:
   - `RESEND_FROM_EMAIL` = `noreply@amibykoko.app`
   - `RESEND_FROM_NAME` = `Àmì by Kòkò`
5. Save and redeploy

---

### **Step 2: Verify Domain in Resend**

1. Go to [Resend Dashboard](https://resend.com/dashboard)
2. Click **Domains** in the left sidebar
3. Click **Add Domain**
4. Enter: `amibykoko.app`
5. Click **Add Domain**

---

### **Step 3: Add DNS Records to Your Domain**

Resend will provide you with 2-3 DNS records to add. Here's what you'll likely need:

#### **Option A: If you bought `amibykoko.app` from a registrar**

Common registrars: GoDaddy, Namecheap, Google Domains, AWS Route53, etc.

**Login to your domain registrar** and add these records:

---

##### **1. SPF Record** (Required - Authorizes Resend to send emails)

| Field | Value |
|-------|-------|
| **Type** | TXT |
| **Name/Host** | `@` (or leave blank) |
| **Value** | `v=spf1 include:_spf.resend.com ~all` |
| **TTL** | 3600 (or Auto) |

**Purpose:** Tells email providers "Resend is allowed to send emails on behalf of amibykoko.app"

---

##### **2. DKIM Record** (Required - Proves emails are from you)

| Field | Value |
|-------|-------|
| **Type** | TXT |
| **Name/Host** | `resend._domainkey.amibykoko.app` |
| **Value** | (copy exactly from Resend Dashboard - it's a long string) |
| **TTL** | 3600 (or Auto) |

**Purpose:** Digital signature that proves emails came from you

---

##### **3. CNAME Record** (Optional - For tracking)

| Field | Value |
|-------|-------|
| **Type** | CNAME |
| **Name/Host** | `resend.amibykoko.app` |
| **Value** | `resend.dev` |
| **TTL** | 3600 (or Auto) |

**Purpose:** Helps with email tracking and verification

---

#### **Option B: If you're using Cloudflare**

1. Go to Cloudflare Dashboard
2. Select `amibykoko.app` domain
3. Go to **DNS → Records**
4. Add the records above

---

#### **Option C: If you're using Vercel + Domain**

1. Go to Vercel Dashboard
2. Select project → **Settings → Domains**
3. Click **Edit** on amibykoko.app
4. Add DNS records in the DNS provider (Cloudflare, GoDaddy, etc.)

---

### **Step 4: Verify DNS Propagation**

After adding DNS records:

1. Go to [DNSChecker.org](https://dnschecker.org)
2. Enter: `amibykoko.app`
3. Check all regions (green checkmarks mean propagation complete)
4. **Wait 5-60 minutes** for DNS to propagate globally

---

### **Step 5: Verify Domain in Resend**

1. Go back to [Resend Dashboard](https://resend.com/dashboard)
2. Click **Domains**
3. Find `amibykoko.app`
4. Click **Verify**

**You'll see:**
- ✅ "DNS verified" (if all records are correct)
- ❌ "Verification failed" (if records are missing or wrong)

**Common issues:**
- Records haven't propagated yet (wait longer)
- Records were added incorrectly (check spelling)
- Wrong record type (must be TXT, not CNAME or A record)

---

### **Step 6: Update Sender Email (Automatic)**

Once verified, your code automatically uses:

```env
RESEND_FROM_EMAIL="noreply@amibykoko.app"
RESEND_FROM_NAME="Àmì by Kòkò"
```

Emails will now show:
```
from: Àmì by Kòkò <noreply@amibykoko.app>
```

instead of:
```
from: Àmì by Kòkò <noreply@resend.dev>
```

---

## 🧪 **Testing Your Setup**

### **Test 1: System Health Check**

```bash
# Call the system health endpoint (as super admin)
GET /api/super-admin/system-health

# Should show:
{
  "checks": {
    "email": {
      "status": "ok",
      "message": "Resend API configured"
    }
  }
}
```

---

### **Test 2: Send Broadcast Email**

1. Go to `/super-admin` in your app
2. Navigate to **Broadcast**
3. Send a test email to **All users** or **School admins**
4. Check that emails arrive with the correct `@amibykoko.app` sender

---

### **Test 3: Verify Email Headers**

When you receive an email, check the headers:

```
from: Àmì by Kòkò <noreply@amibykoko.app>
subject: Test email from Àmì by Kòkò

# In "Show Original" or "View Source":
SPF: PASS
DKIM: PASS
DMARC: PASS
```

This confirms your domain is properly configured!

---

## ⚠️ **Troubleshooting**

### **"SPF Softfail" or "SPF Fail"**

**Problem:** Emails are being rejected or marked as spam.

**Solution:** Ensure SPF record is correct:
```
v=spf1 include:_spf.resend.com ~all
```

---

### **"DKIM Invalid"**

**Problem:** Email signature verification failed.

**Solution:**
1. Check that DKIM record name is exactly: `resend._domainkey.amibykoko.app`
2. Ensure the DKIM value is copied exactly (no extra spaces or characters)
3. Wait 1-2 hours for DNS propagation

---

### **"Domain Not Verified" in Resend**

**Problem:** Resend can't verify your domain.

**Solution:**
1. Check DNS records in [DNSChecker.org](https://dnschecker.org)
2. Ensure all required records are added and propagated
3. If using Cloudflare, make sure "Proxy status" is OFF (orange cloud, not grey)
4. Wait 5-60 minutes after adding records

---

### **Emails Going to Spam**

**Solution:**
1. Ensure SPF and DKIM are passing
2. Add a DMARC record:
   ```
   Type: TXT
   Name: _dmarc.amibykoko.app
   Value: v=DMARC1; p=none; rua=mailto:dmarc@amibykoko.app
   ```
3. Set up proper authentication in Resend

---

## 📞 **Support**

- **Resend Documentation:** https://resend.com/docs
- **DNS Setup Guide:** https://resend.com/docs/domain-verification
- **Troubleshooting:** https://resend.com/docs/troubleshooting

---

## ✅ **Checklist**

Before testing, ensure you've completed:

- [ ] RESEND_API_KEY added to Vercel
- [ ] RESEND_FROM_EMAIL set to `noreply@amibykoko.app`
- [ ] RESEND_FROM_NAME set to `Àmì by Kòkò`
- [ ] SPF record added to domain DNS
- [ ] DKIM record added to domain DNS
- [ ] CNAME record added to domain DNS (if required)
- [ ] DNS records propagated (check at dnschecker.org)
- [ ] Domain verified in Resend Dashboard
- [ ] System health check shows "Resend API configured"

---

## 🚀 **Next Steps**

Once your custom domain is set up:

1. **Test sending a broadcast email**
2. **Monitor email deliverability**
3. **Check spam folders initially**
4. **Consider adding DMARC policy for better deliverability**

Your emails will now appear professional with `@amibykoko.app` domain! 🎉