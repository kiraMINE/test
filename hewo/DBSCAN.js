



//D = ensemble des données (tableau de points), eps = rayon du cercle cluster (int), MinPts = nombre de points devant etre inclus dans le cerlce pour ne pas etre cnsidéré abérrant(int) 
function dbscan(D, eps, MinPts){
	//c = cluster
	c=0;
	for ( i=0; i<D.length;i++){
		//statut du point visité(true)/non visité (False) (tableau booleen)
		if (!D[i].visite){
			D[i].visite=!D[i].visite;
			PtsVoisins=epsVoisinage(D,P,eps);
			if (PtsVoisins.length<eps){
				bruit[i]=true;
			}
			else {
				c++;
				etendreCluster(D,i,PtsVoisins,C,eps,MinPts,C);
			}
		}
	}
}

function etendreCluster(D, P, PtsVoisins, c, eps, MinPts,C){
	C[c].push(P);
	for ( i=0; i<PtsVoisins.length;i++){
		
		
	
	
			
