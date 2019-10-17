ruleset io.picolabs.manifold.smart_mirror {
  meta {
    shares __testing, getDisplaySettings
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      //, { "name": "entry", "args": [ "key" ] }
      ] , "events":
      [ //{ "domain": "d1", "type": "t1" }
      //, { "domain": "d2", "type": "t2", "attrs": [ "a1", "a2" ] }
      ]
    }
    
    getAppList = function() {
      ent:app_list
    }
    
    getDisplaySettings = function() {
      ent:display_settings
    }
    
    setDefaultSettings = function(app_name, app_rid, discovery) {
      display_settings = ent:display_settings;
      settings = (display_settings == null) => {}.put(app_name, {"display": false, "rid": app_rid, "discovery": discovery, "selected": []}) |
      (display_settings{app_name} == null) => display_settings.put(app_name, {"display": false, "rid": app_rid, "discovery": discovery, "selected":[]}) 
      | ent:display_settings;
      
      (settings{"NotificationsCycle"}.isnull()) => settings.put("NotificationsCycle", {"display": false, "rid": "io.picolabs.notifications", "discovery": "", "selected":[]}) | settings
    }
    
    app = { "name":"Smart Mirror", "version":"0.0" };
  }
  
  rule discovery {
  select when manifold apps
  send_directive("app discovered...",
                          {
                            "app": app,
                            "rid": meta:rid,
                            "iconURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAMSGlDQ1BJQ0MgUHJvZmlsZQAASImVVwdYU8kWnltSSWiBCEgJvYlSpEsJoUUQkCrYCEkgocSYEETsyLIKrl1EQF3RVRFF1wLIWrGXRbH3hyIqK+tiwYbKmxTQdb/33vfO9829/z1zzn9K5t7MAKBTw5NKc1FdAPIk+bL4iBDWhNQ0FqkTIAAFdGABnHh8uZQdFxcNoAze/y5vb0BrKFddlFz/nP+voicQyvkAIHEQZwjk/DyI9wOAl/ClsnwAiD5Qbz0jX6rEkyA2kMEEIZYqcZYalyhxhhpXqmwS4zkQ7wSATOPxZFkAaDdDPauAnwV5tG9B7CoRiCUA6JAhDuSLeAKIIyEekZc3TYmhHXDI+IYn62+cGUOcPF7WEFbXohJyqFguzeXN/D/b8b8lL1cxGMMODppIFhmvrBn27VbOtCglpkHcI8mIiYVYH+L3YoHKHmKUKlJEJqntUVO+nAN7BpgQuwp4oVEQm0IcLsmNidboMzLF4VyI4QpBC8X53ESN7yKhPCxBw1kjmxYfO4gzZRy2xreBJ1PFVdqfVOQksTX8t0RC7iD/myJRYoo6Z4xaIE6OgVgbYqY8JyFKbYPZFIk4MYM2MkW8Mn8biP2EkogQNT82JVMWHq+xl+XJB+vFFonE3BgNrsoXJUZqeHbyear8jSBuFkrYSYM8QvmE6MFaBMLQMHXt2GWhJElTL9YhzQ+J1/i+kubGaexxqjA3Qqm3gthUXpCg8cUD8+GCVPPjMdL8uER1nnhGNm9snDofvBBEAw4IBSyggCMDTAPZQNzW09QDn9Qz4YAHZCALCIGLRjPokaKakcBrAigCf0IkBPIhvxDVrBAUQP3nIa366gIyVbMFKo8c8ATiPBAFcuGzQuUlGYqWDB5Djfgf0fkw11w4lHP/1LGhJlqjUQzysnQGLYlhxFBiJDGc6Iib4IG4Px4Nr8FwuOM+uO9gtl/tCU8I7YRHhOuEDsLtqeJi2Xf1sMA40AEjhGtqzvi2ZtwOsnriIXgA5IfcOBM3AS74aBiJjQfB2J5Qy9Fkrqz+e+6/1fBN1zV2FFcKShlGCaY4fO+p7aTtOcSi7Om3HVLnmjHUV87QzPfxOd90WgDvUd9bYouwfdgZ7Dh2DjuENQEWdhRrxi5ih5V4aBU9Vq2iwWjxqnxyII/4H/F4mpjKTspd6127XT+p5/KFhcrvI+BMk86UibNE+Sw2/PILWVwJf+QIlrurmy8Ayv8R9WfqNVP1/4Awz3/VFd8HICB1YGDg0FddNHxP9z8DgNrzVWdfDwD9CABnf+ArZAVqHa68EAAV6MA3yhiYA2vgAOtxB17AHwSDMDAWxIJEkAqmwC6L4HqWgRlgNlgASkE5WA7WgCqwEWwG28EusBc0gUPgODgNLoDL4Dq4C1dPF3gOesFb0I8gCAmhIwzEGLFAbBFnxB3xQQKRMCQaiUdSkXQkC5EgCmQ2shApR1YiVcgmpA75FTmIHEfOIe3IbeQh0o28Qj6iGEpDDVAz1A4dhfqgbDQKTUQno1nodLQILUGXopVoLboTbUSPoxfQ62gH+hztwwCmhTExS8wF88E4WCyWhmViMmwuVoZVYLVYA9YCf+erWAfWg33AiTgDZ+EucAVH4kk4H5+Oz8WX4FX4drwRP4lfxR/ivfgXAp1gSnAm+BG4hAmELMIMQimhgrCVcIBwCr5NXYS3RCKRSbQnesO3MZWYTZxFXEJcT9xNPEZsJ3YS+0gkkjHJmRRAiiXxSPmkUtI60k7SUdIVUhfpPVmLbEF2J4eT08gScjG5gryDfIR8hfyU3E/RpdhS/CixFAFlJmUZZQulhXKJ0kXpp+pR7akB1ERqNnUBtZLaQD1FvUd9raWlZaXlqzVeS6w1X6tSa4/WWa2HWh9o+jQnGoc2iaagLaVtox2j3aa9ptPpdvRgeho9n76UXkc/QX9Af6/N0B6pzdUWaM/TrtZu1L6i/UKHomOrw9aZolOkU6GzT+eSTo8uRddOl6PL052rW617UPembp8eQ89NL1YvT2+J3g69c3rP9En6dvph+gL9Ev3N+if0OxkYw5rBYfAZCxlbGKcYXQZEA3sDrkG2QbnBLoM2g15DfcPRhsmGhYbVhocNO5gY047JZeYylzH3Mm8wPw4zG8YeJhy2eFjDsCvD3hkNNwo2EhqVGe02um700ZhlHGacY7zCuMn4vglu4mQy3mSGyQaTUyY9ww2G+w/nDy8bvnf4HVPU1Mk03nSW6WbTi6Z9ZuZmEWZSs3VmJ8x6zJnmwebZ5qvNj5h3WzAsAi3EFqstjlr8wTJksVm5rErWSVavpallpKXCcpNlm2W/lb1VklWx1W6r+9ZUax/rTOvV1q3WvTYWNuNsZtvU29yxpdj62Ips19qesX1nZ2+XYvejXZPdM3sje659kX29/T0HukOQw3SHWodrjkRHH8ccx/WOl51QJ08nkVO10yVn1NnLWey83rl9BGGE7wjJiNoRN11oLmyXApd6l4cjmSOjRxaPbBr5YpTNqLRRK0adGfXF1dM113WL6103fbexbsVuLW6v3J3c+e7V7tc86B7hHvM8mj1ejnYeLRy9YfQtT4bnOM8fPVs9P3t5e8m8Gry6vW28071rvG/6GPjE+SzxOetL8A3xned7yPeDn5dfvt9ev7/8Xfxz/Hf4PxtjP0Y4ZsuYzgCrAF7ApoCOQFZgeuDPgR1BlkG8oNqgR8HWwYLgrcFP2Y7sbPZO9osQ1xBZyIGQdxw/zhzOsVAsNCK0LLQtTD8sKawq7EG4VXhWeH14b4RnxKyIY5GEyKjIFZE3uWZcPreO2zvWe+ycsSejaFEJUVVRj6KdomXRLePQcWPHrRp3L8Y2RhLTFAtiubGrYu/H2cdNj/ttPHF83Pjq8U/i3eJnx59JYCRMTdiR8DYxJHFZ4t0khyRFUmuyTvKk5LrkdymhKStTOiaMmjBnwoVUk1RxanMaKS05bWta38SwiWsmdk3ynFQ66cZk+8mFk89NMZmSO+XwVJ2pvKn70gnpKek70j/xYnm1vL4MbkZNRi+fw1/Lfy4IFqwWdAsDhCuFTzMDMldmPssKyFqV1S0KElWIesQccZX4ZXZk9sbsdzmxOdtyBnJTcnfnkfPS8w5K9CU5kpPTzKcVTmuXOktLpR3T/aavmd4ri5JtlSPyyfLmfAO4Yb+ocFD8oHhYEFhQXfB+RvKMfYV6hZLCizOdZi6e+bQovOiXWfgs/qzW2ZazF8x+OIc9Z9NcZG7G3NZ51vNK5nXNj5i/fQF1Qc6C34tdi1cWv1mYsrClxKxkfknnDxE/1Jdql8pKb/7o/+PGRfgi8aK2xR6L1y3+UiYoO1/uWl5R/mkJf8n5n9x+qvxpYGnm0rZlXss2LCculyy/sSJoxfaVeiuLVnauGreqcTVrddnqN2umrjlXMbpi41rqWsXajsroyuZ1NuuWr/tUJaq6Xh1SvbvGtGZxzbv1gvVXNgRvaNhotrF848efxT/f2hSxqbHWrrZiM3FzweYnW5K3nPnF55e6rSZby7d+3ibZ1rE9fvvJOu+6uh2mO5bVo/WK+u6dk3Ze3hW6q7nBpWHTbubu8j1gj2LPH7+m/3pjb9Te1n0++xr22+6vOcA4UNaINM5s7G0SNXU0pza3Hxx7sLXFv+XAbyN/23bI8lD1YcPDy45Qj5QcGThadLTvmPRYz/Gs452tU1vvnphw4trJ8SfbTkWdOns6/PSJM+wzR88GnD10zu/cwfM+55sueF1ovOh58cDvnr8faPNqa7zkfan5su/llvYx7UeuBF05fjX06ulr3GsXrsdcb7+RdOPWzUk3O24Jbj27nXv75Z2CO/13598j3Cu7r3u/4oHpg9p/Of5rd4dXx+GHoQ8vPkp4dLeT3/n8sfzxp66SJ/QnFU8tntY9c392qDu8+/IfE//oei593t9T+qfenzUvHF7s/yv4r4u9E3q7XspeDrxa8tr49bY3o9+09sX1PXib97b/Xdl74/fbP/h8OPMx5ePT/hmfSJ8qPzt+bvkS9eXeQN7AgJQn46m2AhgcaGYmAK+2wX1CKgCMy3D/MFF9zlMJoj6bqhD4T1h9FlSJFwAN8KbcrnOOAbAHDrv5kBs+K7fqicEA9fAYGhqRZ3q4q7lo8MRDeD8w8NoMAFILAJ9lAwP96wcGPm+Byd4G4Nh09flSKUR4Nvg5WImuGwnmg+/k37gkgDSHreDYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAM3klEQVR4Ae1da2wcVxW+fqyfsaOqeaGkzaOJ81AQLfxqiRXVTixeRUj9gQL/QFARUycIqVWRqkoIoYpUiuKmlCIhJBBI/OBPgAg1IrIbGQVVtKSE5uG4jgNN3cRJ49d6vV7b3G9mz+71nTs7d2bntZu50WRm7pxzH993zzl37uyMGUtSgkCCQIJAgkCCgDcEapzUTpw4MchlPs+3Wr45yjuVdx9ez/A+16Hfy8vLfzp69OjTpTCwBbi/v/8xXsA7pZSTa54QWOK47uHEXFFpKwk5fvz4o7W1te+qFJI83xDoOHLkyLBcGtyQJSVkWCAJIuOSqlALIfmYoZJN8vxFoI6HhVfkIi2EcAEE8CSFgACPJYflaurlDH6uImmF2KZNm1hHRwfjrm1F/v1+UlNTw7BlMhl29epVNj4+7gRJsyygIkQZ6KFYV1fH9u3bx1KplFxOcs4R4CPe2BoaGtjevXvZrl272Llz59ji4qI2PtpDHGR0d3cnZGhDy1h9fT3r6uoyBrKumjYh+/fvZ0tLS7rlJnJ5BGA1nZ2d2nhoEbJx48ay4wV8K1wdLO1+S7CUDRs2aHVbixD4wnISSGhqamLNzc3GPsjJQFyJxyRIJ6mCukUPAML03CaAg9EBIhDokObn542ZiNuydORBPOqBJSKQzs3NxcbNYkDqJC1CvJLR2NjIWltbC+4OMSiXywUCEgYNyEDHQUyQxOsAK8voYqhFiFy40zkso6WlxbAMHFNaWFhg2WzW0dqgQ9ZFJFIZqj1kQT6RQTpxmoRERgjAaWtrMwASwYNlwIU4zclFcDHqQeLs7KytVUEGLkokA9ahQ7zYvrgc+2ohAKe9vd1yr4LRMTMzY7irUh2Hq4Flif4WBIIkVSIyEKMQq2ARIAJ3yk7Eq8qLQ55vhAA0FRnoZDqdNshQmS30ACyIgNsRwYc8gFW5HiID5MFCIAPLABkq+TiArdMGXwgpRQYAgquyIwOAggwALCe4K+jLuqgPAdzOMmR5udw4n5dNCMBBzKBprdhZAApXpQKI9GAVqoSYQ5YlX4dFEBkom4iDTqWnsgnBtFYFKlzN9PS0kgxYg517A6DQtYs50AX5ZFFwTyAEmx+JLw+6KobPB13JOwl7JgQjHKMUm5wA6OTkpDKwQk+XDNmyoAvyYSE4BhkUxOU2VOq5Z0IADKxDTk5kwL0BUFUCwJjiAmQ5wSKgJ09vVTFG1q2kc2sk1Wg9TU9lUQA6NTVlaxmrVq1SujeUA124KcyU5ERkiHGDLAMDoJqSJwuBdYAUMSGgImbYBVZYk3h/IerC/yOAqywD9aA+xA1YCIgLYnrrNnaI7ffz2BMhAAUbBVYAhNGNPDmVijWQBYlwO6okLkyiLpQvWoYcY1Rl6OTFhQy01RMh5FYwemERGOEqMlABRjfuM+QEebg3u9kRCIAuNpAa1PQ2TmQAI0+EABy7US0CT7EGgFIiYGEZdiRCnsiAHnQQKzAQ7Aik8it974kQ3U4DVDnW4K691HMKCuCINzgmAkEGWaZu/ZUoFyghsABsZCEI3LAsO8sgMmg2BTmQoLNK7AX8uLkr9CFQQmhE68QayMCigp5NeSEuTJ1ACdGNNWHNpkRg42gdaF+ghIgA2B2HNZsS648rGWijpzt1sXPlHEcxm4ozGcAyMguhAB7mbCruZERGCJHhNJtyC6DdUrjbcsqx+nJ1Q7EQmvaisZhNYU0KM6pSa1OVBGK5JIj6oRCC2RYSiMGMCm5K9aMEkvNKhlc9EZCoj0MhhDoJiyA3RXfguFG0WyEmPS97/mYle+36aovqNzbOsAcbrIugFsGIMkIjBHFD59GrH6P81dF2Wzh//+Eq49qzW6dsZaK8EMq0l6a3sBAcY0mEltHFzpPLEvPcHpciQyxLV07UCeM4cELIMhA3ENBBBtyU8qdBxUVhT313C7JbeU+NcqkUqMtSTW/JMsp99Pr69TaWWy6TQQ4WyqivcfdLE5cYuxIPzEKIDFhGqekttdZN7MDI9oMM1A1i45QCsRDECZpRERmiZZQTKy5Mme+ZxAlEP9sSCCEUN+R7DT+mt2/d0XvxxU+QwiwrEEJgIbACxAmQgOci1f7o1S/SAiEERGAmBTeFWZUfluFXh+NeTiCEwDr8JiHIKSqV3VS7zL6zeTpSzgIhxO8eEWBuys0uLLKx67eVKtseWc/qaq1T5sxSDUNdUd7Fx4KQUlPek9ftl0GUaPPM4eHS3xj5YORjQ3XHDvW74/+eTrFPt/nza3q7NtrlR05IKTLQ6PxCsV37LfkiGZu3rGW7Vy+xkbT54+6HmxfZ+xM59tHNTww9yKpIGZhojoyQwG4MLUgpMpzIUKiUzBLJ6O9pYQ2pOoMMuCBsN+bq2OGdWYZrlEQdyotyHwkhIMJvMm7fmSngSKN+W6vpdsbmio7gN/8z78x//GTxVYrcYnyW40MnxG8iiIV7d01CaPS/dbeRjabr2fe2TLNT4y1GsH5m8xR/32nZOP4tJ+a5x82bzNEPblExke9DJyToHp/+2HRHFyYbefypKaxV7WzLsjfG2jkdNez7+Wch76WLVhJ0u3TLD5UQL9bhdgr6xfVptn9NxogZvVtgEcw47uF56xrMl0Ipj4K9DJbbOmX9cs5DJcRrQ7/1UDE+OJVxkt9HDE6Yrug1PmWmhXXcX9zKmrHkXraWnbRZ5Y2SDPStIghprV8yRjl/vOXEhyEHIRDQwu+8ATCOySoeSC2x1hS3Ve7ORPB38gmAeO5YUUACxelHQBX4WezhrfaW0jds1gTwkYgInB/mruvn3Fro2i+4ddTyBVDzPG3I96ybM/ZR/1dRhOiANXxtnPUfNAP7F9al2fbWXME6MNt6av1s4fWIvjdNMlpS1mUUnbqCkKkIl6XTcZruImj8d8p0bTvyZJD+VzekC2T88Urx1euXn7S+a086Ye+rhhAA97Wd5hLJsfMZduy89fVqAvcHZ9JscKz4GY7X/6l+6ZTkw9xXlcvq2pxilyYW2ZU7S9xKFhm5pC9vT7E7c8vs/IdFEkSQL3F5yBasTLwY8nFVWQiw6/1ckwXYv1xbsJAB8Ne2rOw+ERgyByuqqyoLEXtGo/3cjRw7NWzGi2c+28S2P1Ak4XbaOo2O2lKKrRN7U0XHnQ/Xs2PdLcYmkoEuEmlyd6O0lKonRAZbPo8bKaESghdq5H8yQFGcx4mUUAmJAmzdOlWkqPJ0y/MqlxAiICcSIB4LIoEfxnqWRcE1THDEuqKoP3JCqNPy0BOBka95Pae6gijba5tkvcgJoQYRSATaP27mbKelpFON+9gQQuB+97EG9st3s+zU1Rz73UXzho7I+tFAhs1kizdzlA9dIpLKEa9Rnt1e1v3Munr27UeLv7J/+e8ZdnPGrBfrwifyv1rBmtgiPQHj+a/2lP9IOHZB/dfvmSTsWbOyaRdu5QpkHNpjgnUjv6pLgPZsS7GG/JcHKc+OBDn/pc4m9rOu/PN4XpeYiAzkAf//TJjkgIw1LTXsle7yiaD6YmMhMoDf3NvA4LYo/epfK63l8U1m0386ZK7UvrivyVib+gpfSJTLojLs9qI1rW6sYZPzwrDnSuJ1lP3GOxn2Qv4XKzn+Dc5GPgj8sA60LzaEiGCJAIj5quPxWXO0iguFW1fXstHJomtT6Yl5/W/Ps2ufuPu66afaTAu+x8l79s1Z/gSSu7KD5VtKbAhxQ4IIpurYDRk//FuGLfAfyj21vYEd3FbPXhycs1iIqg7kkVWAkCVuVKdHsuxLjxRjj51eqfyVjrqUZEyunR4xf40Iv/4R317irgrJrZui7oAMJJCBJLsr5FHZtH/ioTp2K2+ZuE7EjN7Tt0roqVJsLETVODEPFgRA/soJwYb0/BNN7EHhmQYBhmuIKXZJlPv6nkb2h/fnC6CTjvwhG1Hn0O4mNsiX9X8yNEvixh7PYspNlqf7/I8Tr4xovIYDBw6UW4+jvpcf0TkW6iAgg+4gXtZlvOZ35swZSxn8T3iv4EDLQuidQUtpPmaI4ARJjliPj813LAoY6iQtQvDCJt6oDStFBVqQ/cM7lzpJK6iPjY3plJXIlEAAfz1aJ6kIscSQ0dFRnbISGRsE8AKsxp/yNrRVhCid3dDQkE11SXYpBBA78Ce8dZOKEOVkGl/vGRgY8P11Z92GVqIcLOPs2bPKv6eS749lecBCCGf0z3adRwUg5fLly8YHAXRnDnblVVs+8MBnRfDBhIsXLxpYlfrqEZd/QcZA6Z74vQiYs5AlKyfnZSEwwe9B1solKEHnzHXIgsm5rwjM89uIraoSlYT09fWN8G+UQMFc81ZpJnleEbjLyVjT29urfNlF6bLEmvr7+w/xb5c8x/N28w1LmY46on5yXEBgmXue5/lgP1bISQ4SBBIEEgQqG4H/Aw+c0ukIBxl3AAAAAElFTkSuQmCC",
                            "bindings" : {}
                          } );
  }
  
  
  rule availableManifoldApps {
    select when mirror available_apps or manifold update_version or wrangler ruleset_added
    pre {
      apps = event:attrs{["content", "directives"]}
      attrs = event:attrs.klog("The event attrs are")
    }
    if not apps then
    http:get(<<#{meta:host.klog("host")}/sky/event/#{meta:eci}/apps/manifold/apps>>, 
                      parseJSON=true, 
                      autosend={
                        "eci":meta:eci, "domain":"mirror", "type":"available_apps"
                      });
    notfired {
      ent:app_list := apps.klog("apps");
      raise mirror event "default_display_settings"
    }
  }
  
  rule setDefaultDisplaySettings {
    select when mirror default_display_settings
    foreach ent:app_list setting(x)
    pre {
      app_name = x{"options"}{"app"}{"name"}
      app_rid = x{"options"}{"rid"}
      discovery = x{"options"}
    }
    if ent:display_settings{app_name}.isnull() then noop()
    fired {
      ent:display_settings := setDefaultSettings(app_name, app_rid, discovery)
    }
  }
  
  rule changeDisplaySettings {
    select when mirror change_display_settings
    pre {
      app_name = event:attr("name");
      selected = event:attr("selected");
    }
    always {
      ent:display_settings := ent:display_settings.set([app_name, "selected"], selected.decode());
    }
  }
  
}
