const restrictedAccess = (path, method) => {
    const pathlist = path.split('/')
    if (path === '/topics' && method === 'POST'){
        return true;
    }
    if (pathlist[1]==='topics' && pathlist[3]==='delete' && method ==='POST') {
        return true;
    } 
    
    return false;
    
};

const acl = [
    {
        path: '/topics',
        needsAuthentication: true,
        checkAdmin: true,
    },

    {
        path: '/quiz',
        needsAuthentication: true,

    },

    {
        path: '/',
        needsAuthentication: false,

    },
    {
        path: '/api',
        needsAuthentication: false,

    },
    {
        path: '/auth',
        needsAuthentication: false,

    },

];
const aclMiddleware = async ({ request, response, state }, next) => {
    const pathname = request.url.pathname;
    const method = request.method;
    for (const aclRule of acl) {
      // if the requested path is not related to this access control rule,
      // continue from the next rule
      if (!pathname.startsWith(aclRule.path)) {
        continue;
      }
      
  
      // if there is no need to authenticate,
      // continue with showing the content
      if (!aclRule.needsAuthentication) {
        await next();
        return;
      }
  
      // if the user is not authenticated, deny access
      if (!(await state.session.get("authenticated"))) {
        response.redirect("/auth/login");
        return;
      }
  
      // if the path does not expect any roles, grant access to it
      if (!aclRule.checkAdmin){
        await next();
        return;        
      }
      if (!restrictedAccess(pathname,method)) {
        await next();
        return;
      }
  
      // if the user is admin, grant access,
      // otherwise deny access.
      const user = await state.session.get("user");
      if (user.admin) {
        await next();
        return;
      } else {
        response.status = 401;
        return;
      }
    }
  
    // deny all others!
    response.status = 401;
  };

  export { aclMiddleware };
  
 