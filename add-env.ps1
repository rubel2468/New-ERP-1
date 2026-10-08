# Vercel Environment Variables Bulk Add Script
# Run: .\add-env.ps1

$envVars = @{
    "MONGODB_URI"             = "mongodb+srv://rubel:rubel2468@cluster0.m7n3ky6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    "NEXTAUTH_SECRET"         = "aebc7c35-1107-44fc-9de7-75194d8edd7b"
    "NEXTAUTH_URL"            = "https://new-erp-1.vercel.app"
    "EMAIL_SERVICE"           = "gmail"
    "EMAIL_USER"              = "rk1769950@gmail.com"
    "EMAIL_PASS"              = "wzri flwl xxka fubk"
    "STORE_ID"                = "wczep68e90d5632880"
    "STORE_PASSWORD"          = "wczep68e90d5632880@ssl"
    "SSLCOMMERZ_IS_SANDBOX"   = "true"
    "AWS_REGION"              = "us-east-1"
    "AWS_ACCESS_KEY_ID"       = ""
    "AWS_SECRET_ACCESS_KEY"   = ""
    "AWS_S3_BUCKET_NAME"      = ""
}

Write-Host "Adding environment variables to Vercel..." -ForegroundColor Cyan

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    if ($value -eq "") {
        Write-Host "Skipping $key (empty value)" -ForegroundColor Yellow
        continue
    }
    Write-Host "Adding: $key" -ForegroundColor Green
    $value | vercel env add $key production --force 2>&1
}

Write-Host "`nDone! All environment variables added." -ForegroundColor Cyan
Write-Host "Now run: vercel --prod" -ForegroundColor White

