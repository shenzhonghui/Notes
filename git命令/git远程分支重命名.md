### Git命令可以很方便地重命名本地分支：

> git branch -m <old_branch_name> <new_branch_name>  

如果想在远程重命一个分支名，则须使用以下思路：

* 再本地clone版本中重命名分支
* 删除远程待修改的分支名
* 则本地的新分支名push到远程

例子：
1 首先是本地重命名：
> git branch -m oldPatch newPatch

常见问题：
如果遇到重命名失败的情况，如下面这样：
>error: refname refs/heads/HEAD not found
>fatal: Branch rename failed
解决方法：新建一个分支,重命名新的分支
> git checkout master
> git checkout -b new_branch

参考资料： http://stackoverflow.com/questions/18382986/git-rename-local-branch-failed

2 接下来删除远程待修改的分支名：  
>git push origin :oldPatch

3 最后将本地的新分支名push到远程：
>git push origin newPatch

 补偿命令：

 git branch -m <old_name> <new_name> 改名字 (如果有同名会失败，改用 -M 可以强制覆盖)
