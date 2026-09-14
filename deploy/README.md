# 서버 반영 안내

운영 서버(Apache 2.4)의 실제 설정 파일 **두 개**를 고쳐야 한다.

```
/etc/apache2/sites-available/000-default.conf   (80 포트)
/etc/apache2/sites-available/default-ssl.conf   (443 포트)
```

각각 맨 앞 블록이 apex·www 를 `total.training-center.org` 로 301 시키고 있다.
**그 301 이 살아 있는 한 공개 소개 사이트는 접근 자체가 불가능하다.**

이 디렉터리의 `000-default.patch.conf` / `default-ssl.patch.conf` 가
해당 블록을 무엇으로 바꿔야 하는지 보여준다.

## 순서

1. 백엔드 배포 (공개 API 가 살아 있어야 프론트 빌드가 통과한다)
2. 두 설정 파일의 apex 블록 교체
3. `apache2ctl configtest` → `systemctl reload apache2`
4. `npm run deploy` (→ /var/www/public)
5. total-frontend 재배포 (noindex 반영)

## 확인

```bash
curl -sI https://training-center.org/            # 200 이어야 한다 (301 아님)
curl -s  https://training-center.org/about | grep -o '<h1[^>]*>[^<]*'   # 본문이 보여야 한다
curl -sI https://www.training-center.org/        # apex 로 301
curl -s  https://training-center.org/sitemap.xml | head -3
```

`/about` 이 리다이렉트 없이 200 이어야 한다. 301 이 끼면 사이트맵의 모든 URL 이
리다이렉트를 거치게 된다.
