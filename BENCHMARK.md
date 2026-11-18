


| model   | API | Ctx |    pp |   tg  | time | t/s   | MTP | split  |   comments   |
|---------|-----|-----|-------|-------|------|-------|-----|--------|--------------|
| Q3_K_XL |  VK | 256 | 13536 | 71245 | 3859 | 21.97 |  on | layer  |              |
| Q3_K_XL |  VK | 256 | 24816 | 55629 | 3653 | 22.02 |  on | tensor | CPU bound?   |
| Q4_K_XL |  VK | 200 | 16310 | 43486 | 2487 | 24.04 | off | layer  |              |
| Q4_K_XL |  VK |  |  |  |  |  | off | tensor |   |

